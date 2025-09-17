import { FastifyRequest, FastifyReply } from "fastify";
import * as cartService from "@/services/cart.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const cartController = {
  upsert: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { product, quantity, store, observations, updateQuantity } =
        request.body as any;

      const cart = await cartService.upsertCart(
        user._id,
        store,
        { product, quantity, observations },
        updateQuantity,
        user.role
      );
      return reply.status(200).send({ message: "Cart updated", result: cart });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const cart = await cartService.readCart(user._id, user.role);
      return reply.status(200).send({ message: "Cart fetched", result: cart });
    } catch (err: any) {
      return reply.status(500).send({ message: err.message });
    }
  },

  removeItem: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { productId } = request.params as any;

      const cart = await cartService.removeItemFromCart(
        user._id,
        productId,
        user.role
      );
      if (!cart) {
        return reply.status(200).send({ message: "Cart cleared" });
      } else {
        return reply
          .status(200)
          .send({ message: "Item removed", result: cart });
      }
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  },

  clear: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      await cartService.clearCart(user._id, user.role);
      return reply.status(200).send({ message: "Cart cleared successfully" });
    } catch (err: any) {
      return reply.status(500).send({ message: err.message });
    }
  },

  convertToOrder: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const deliveryLocation = request.body as any;
      const order = await cartService.convertCartToOrder(
        user._id,
        deliveryLocation,
        user.role
      );
      return reply
        .status(201)
        .send({ message: "Order created", result: order });
    } catch (err: any) {
      return reply.status(400).send({ message: err.message });
    }
  },
};

export default cartController;
