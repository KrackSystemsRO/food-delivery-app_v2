import mongoose from "mongoose";
import cartModel from "@/models/cart.model";
import orderModel from "@/models/order.model";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

interface CartItem {
  product: string;
  quantity: number;
  observations?: string;
}

interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
}

export async function upsertCart(
  userId: string | mongoose.Types.ObjectId,
  storeId: string,
  item: CartItem,
  updateQuantity = false,
  role: string
) {
  if (
    !mongoose.Types.ObjectId.isValid(item.product) ||
    !mongoose.Types.ObjectId.isValid(storeId)
  ) {
    throw new Error("Invalid product or store ID");
  }
  checkPermissionOrThrow(role, "create", "cart");
  let cart = await cartModel.findOne({ user: userId });

  if (cart) {
    if (cart.store.toString() !== storeId) {
      throw new Error("Cart only supports one store at a time");
    }

    const existingItem = cart.items.find(
      (i) => i.product.toString() === item.product
    );
    if (existingItem) {
      existingItem.quantity = updateQuantity
        ? item.quantity
        : existingItem.quantity + item.quantity;
      if (item.observations) existingItem.observations = item.observations;
    } else {
      cart.items.push(item);
    }

    cart.updatedAt = new Date();
    await cart.save();
  } else {
    cart = new cartModel({ user: userId, store: storeId, items: [item] });
    await cart.save();
  }

  return cart;
}

export async function readCart(
  userId: string | mongoose.Types.ObjectId,
  role: string
) {
  checkPermissionOrThrow(role, "read", "cart");

  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product", "name price image available")
    .populate("store", "name is_open")
    .lean();
  return cart;
}

export async function removeItemFromCart(
  userId: string | mongoose.Types.ObjectId,
  productId: string | mongoose.Types.ObjectId,
  role: string
) {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("Invalid product ID");
  checkPermissionOrThrow(role, "delete", "cart");
  const cart = await cartModel.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  cart.updatedAt = new Date();

  if (cart.items.length === 0) {
    await cart.deleteOne();
    return null;
  } else {
    await cart.save();
    return cart;
  }
}

export async function clearCart(
  userId: string | mongoose.Types.ObjectId,
  role: string
) {
  checkPermissionOrThrow(role, "delete", "cart");
  await cartModel.deleteOne({ user: userId });
}

export async function convertCartToOrder(
  userId: string | mongoose.Types.ObjectId,
  deliveryLocation: DeliveryLocation,
  role: string
) {
  checkPermissionOrThrow(role, "read", "cart");
  const cart = await cartModel
    .findOne({ user: userId })
    .populate("items.product");
  if (!cart) throw new Error("Cart not found");

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const newOrder = new orderModel({
    user: userId,
    store: cart.store,
    items: cart.items,
    total,
    deliveryLocation,
    status: "pending",
  });

  await newOrder.save();
  await cartModel.deleteOne({ user: userId });

  return newOrder;
}
