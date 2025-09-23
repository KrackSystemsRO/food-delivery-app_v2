import { FastifyRequest, FastifyReply } from "fastify";
import * as orderService from "@/services/order.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const orderController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const order = await orderService.createOrder(
        {
          userId: user._id.toString(),
          ...(request.body as any),
        },
        user.role
      );

      setTimeout(() => {
        orderService.emitOrderToRelevantSockets(request.server.io, order);

        // Assert non-null if it's guaranteed
        request.server.io
          .to(`store:${order.store!._id.toString()}`)
          .emit("newOrder", order);
      }, 0);

      return reply.status(201).send({
        status: 201,
        message: "Order created successfully!",
        result: order,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      const order = await orderService.getOrder(id, user.role);
      if (!order)
        return reply
          .status(404)
          .send({ status: 404, message: "Order not found!" });

      return reply.status(200).send({
        status: 200,
        result: order,
        message: "Order fetched successfully!",
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const query = request.query as any;
      const result = await orderService.listOrders(
        {
          ...query,
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
        },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Orders fetched successfully!",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      const updated = await orderService.updateOrder(
        id,
        request.body,
        user.role
      );

      if (!updated)
        return reply
          .status(404)
          .send({ status: 404, message: "Order not found" });

      setTimeout(() => {
        orderService.emitOrderToRelevantSockets(request.server.io, updated);
      }, 0);
      // orderService.emitOrderToCouriers(request.server.io, updated);
      // request.server.io
      //   .to(`client:${user._id.toString()}`)
      //   .emit("update_order", updated);

      return reply.status(200).send({
        status: 200,
        message: "Order updated successfully!",
        result: updated,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      await orderService.deleteOrder(id, user.role);

      return reply
        .status(200)
        .send({ status: 200, message: "Order deleted successfully!" });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  accept: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { orderId } = request.body as { orderId: string };

      const order = await orderService.acceptOrder(orderId, user);

      setTimeout(() => {
        orderService.emitOrderToRelevantSockets(request.server.io, order);
      }, 0);

      return reply
        .status(200)
        .send({ status: 200, message: "Order accepted!", result: order });
    } catch (err: any) {
      console.log(err.message);
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  deny: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      console.log(user);
      const { orderId } = request.body as { orderId: string };

      const order = await orderService.denyOrder(orderId, user);

      // emit to sockets asynchronously
      setTimeout(() => {
        orderService.emitOrderToRelevantSockets(request.server.io, order);
      }, 0);

      return reply
        .status(200)
        .send({ status: 200, message: "Order denied!", result: order });
    } catch (err: any) {
      return reply.status(500).send({
        status: 500,
        message: err?.message ?? "Internal server error",
      });
    }
  },

  getOrdersByStores: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      // Expect store IDs as an array in the body or query
      const { stores } = request.body as { stores: string[] }; // or request.query

      if (!stores || !stores.length) {
        return reply
          .status(400)
          .send({ status: 400, message: "No stores provided" });
      }

      const orders = await orderService.listOrders(
        { store: { $in: stores } },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        result: orders,
        message: "Orders fetched successfully!",
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};

export default orderController;
