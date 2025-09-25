import mongoose from "mongoose";
import orderModel from "@/models/order.model";
import productModel from "@/models/product.model";
import { getQueryById } from "@/utils/getQueryById";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";
import { Server } from "socket.io";
import { Types } from "@my-monorepo/shared";

interface OrderItem {
  product: string;
  quantity: number;
  observations: string;
  price: number;
}

interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

export async function createOrder(
  data: {
    userId: string;
    store: string;
    items: OrderItem[];
    deliveryLocation: DeliveryLocation;
  },
  role: string
) {
  const { userId, store, items, deliveryLocation } = data;

  checkPermissionOrThrow(role, "create", "orders");

  const productIds = items.map((i) => i.product);
  const products = await productModel
    .find({ _id: { $in: productIds } })
    .select("_id price");

  let total = 0;

  for (const item of items) {
    const product = products.find(
      (p) => p._id.toString() === item.product.toString()
    );
    if (!product) throw new Error(`Product with id ${item.product} not found`);
    const price = Number(product.price);
    if (isNaN(price))
      throw new Error(`Invalid price for product ${product._id}`);
    total += price * item.quantity;
  }

  const order = new orderModel({
    user: userId,
    store,
    items,
    total,
    deliveryLocation,
    status: "pending",
    couriers: [],
  });

  await order.save();
  const responce = await order
    .populate([
      { path: "user", select: "first_name last_name email" },
      { path: "store", select: "name zoneId cityId is_open" },
      { path: "items.product", select: "name image available" },
    ])
    .then((o) => o.toObject());

  return responce;
}

export async function getOrder(id: string, role: string) {
  checkPermissionOrThrow(role, "read", "orders");
  return await orderModel
    .findOne(getQueryById(id, "orderId"))
    .populate({ path: "store", select: "name zoneId cityId is_open" })
    .populate({ path: "user", select: "first_name last_name email" })
    .populate({ path: "items.product", select: "name image available" })
    .lean()
    .exec();
}

export async function listOrders(
  params: {
    _id?: string;
    user?: string;
    store?: string | { $in: string[] };
    status?: string;
    date?: Date;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: "asc" | "desc";
  },
  role: string
) {
  checkPermissionOrThrow(role, "read", "orders");
  const {
    _id,
    user,
    store,
    status,
    date,
    page = 1,
    limit = 10,
    sort_by = "createdAt",
    order = "desc",
  } = params;

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const filter: any = {};
  if (_id && mongoose.Types.ObjectId.isValid(_id))
    filter._id = new mongoose.Types.ObjectId(_id);
  if (user && mongoose.Types.ObjectId.isValid(user))
    filter.user = new mongoose.Types.ObjectId(user);
  if (store) {
    if (typeof store === "string" && mongoose.Types.ObjectId.isValid(store)) {
      // single store id
      filter.store = new mongoose.Types.ObjectId(store);
    } else if (
      typeof store === "object" &&
      "$in" in store &&
      Array.isArray(store.$in)
    ) {
      // multiple store ids
      filter.store = {
        $in: store.$in
          .filter((id): id is string => mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id)),
      };
    }
  }
  if (status) {
    filter.status = status;
  }
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    filter.createdAt = { $gte: start, $lte: end };
  }

  const [orders, totalCount] = await Promise.all([
    orderModel
      .find(filter)
      .populate({ path: "user", select: "_id first_name last_name email" })
      .populate({ path: "store", select: "_id name zoneId cityId is_open" })
      .populate({ path: "items.product", select: "_id name image available" })
      .sort({ [sort_by]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    orderModel.countDocuments(filter),
  ]);

  return {
    result: orders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function updateOrder(id: string, data: any, role: string) {
  checkPermissionOrThrow(role, "update", "orders");
  return await orderModel
    .findOneAndUpdate(getQueryById(id, "orderId"), data, {
      new: true,
      runValidators: true,
    })
    .populate({ path: "user", select: "_id first_name last_name email" })
    .populate({ path: "store", select: "_id name zoneId cityId is_open" })
    .populate({ path: "items.product", select: "_id name image available" })
    .lean()
    .exec();
}

export async function deleteOrder(id: string, role: string) {
  checkPermissionOrThrow(role, "delete", "orders");

  const deleted = await orderModel
    .findOneAndDelete(getQueryById(id, "orderId"))
    .lean();
  if (!deleted) throw new Error("Order not found");

  return deleted;
}

export async function acceptOrder(orderId: string, user: Types.User.UserType) {
  checkPermissionOrThrow(user.role, "accept", "orders");
  const order = await orderModel.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (!user) throw new Error("User not found");

  if (user.role === "COURIER") {
    const alreadyAssigned = order.couriers.some(
      (c: any) => c.user.toString() === user._id.toString()
    );

    if (alreadyAssigned)
      throw new Error("You are already assigned to this order");

    order.couriers.push({ user: user._id, procedure: "picked" });
    order.status = "delivering";
    await order.save();
  } else if (user.role === "MANAGER") {
    if (order.status !== "pending")
      throw new Error("Order is not in a pending state");
    order.status = "confirmed";
    await order.save();
  } else {
    throw new Error("You are not allowed to accept orders");
  }

  return await order
    .populate([
      { path: "user", select: "first_name last_name email" },
      { path: "store", select: "name zoneId cityId is_open" },
      { path: "items.product", select: "name image available" },
    ])
    .then((o) => o.toObject());
}

export async function denyOrder(orderId: string, user: Types.User.UserType) {
  checkPermissionOrThrow(user.role, "accept", "orders");
  const order = await orderModel.findById(orderId);
  if (!order) throw new Error("Order not found");

  // if (user.role === "COURIER") {
  //   const alreadyAssigned = order.couriers.some(
  //     (c: any) => c.user.toString() === user._id.toString()
  //   );
  //   if (alreadyAssigned)
  //     throw new Error("You are already assigned to this order");

  //   order.couriers.push({ user: user._id, procedure: "picked" });
  //   order.status = "on_the_way";
  //   await order.save();
  // } else
  if (user.role === "MANAGER") {
    if (order.status !== "pending")
      throw new Error("Order is not in a pending state");
    order.status = "cancelled";
    await order.save();
  } else {
    throw new Error("You are not allowed to deny orders");
  }

  return await order
    .populate([
      { path: "user", select: "first_name last_name email" },
      { path: "store", select: "name zoneId cityId is_open" },
      { path: "items.product", select: "name image available" },
    ])
    .then((o) => o.toObject());
}

export function emitOrderToCouriers(io: Server, order: any) {
  if (order.store.zoneId) {
    io.to(`orders:zone:${order.store.zoneId.toString()}`).emit(
      "update_order",
      order
    );
  } else if (order.store.cityId) {
    io.to(`orders:area:${order.store.cityId.toString()}`).emit(
      "update_order",
      order
    );
  }
}

/**
 * Emit order updates to all relevant sockets:
 * - Client
 * - Store manager(s)
 * - Couriers
 */
export function emitOrderToRelevantSockets(io: Server, order: any) {
  if (!order) return;

  console.log("Emitting order update:", {
    userId: order.user?._id,
    storeId: order.store?._id,
    orderId: order._id,
  });

  // 1️⃣ Client
  if (order.user?._id) {
    io.to(`client:${order.user._id.toString()}`).emit("order:update", order);
  }

  // 2️⃣ Store manager(s)
  if (order.store?._id) {
    io.to(`store:${order.store._id.toString()}`).emit("order:update", order);
    io.to(`store:${order.store._id.toString()}`).emit("newOrder", order);
  }

  // 3️⃣ Couriers (all couriers or by city/zone if available)
  io.to("orders:all").emit("order:update", order);
  if (order.store?.cityId) {
    io.to(`city:${order.store.cityId.toString()}`).emit("orderUpdated", order);
  }
  if (order.store?.zoneId) {
    io.to(`zone:${order.store.zoneId.toString()}`).emit("orderUpdated", order);
  }
}
