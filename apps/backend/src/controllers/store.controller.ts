// libs
import { type FastifyReply, type FastifyRequest } from "fastify";
import {
  getUserFromRequest,
  unauthorized,
  verifyToken,
} from "@/utils/auth.helpers";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

// services
import * as storeService from "@/services/store.service";
import { StoreInput, StoreListQuery } from "@/interfaces/store.interface";

export default {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const newStore = await storeService.createStore(
        request.body as StoreInput,
        user._id,
        user.role
      );

      return reply.status(201).send({
        status: 201,
        message: "Store created successfully",
        result: newStore,
      });
    } catch (err: any) {
      return reply.status(500).send({
        status: 500,
        message: err.message || "Something went wrong",
      });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as { id: string };

      const store = await storeService.getStore(id, user.role);

      if (!store) {
        return reply
          .status(404)
          .send({ status: 404, message: "Store not found" });
      }

      return reply.status(200).send({ status: 200, result: store });
    } catch (err: any) {
      return reply.status(500).send({
        status: 500,
        message: err.message || "Something went wrong",
      });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const result = await storeService.listStores(
        request.query as StoreListQuery,
        user
      );

      return reply.status(200).send({
        status: 200,
        message: "Stores fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({
        status: 500,
        message: err.message || "Server error",
      });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as { id: string };

      const updatedStore = await storeService.updateStore(
        id,
        request.body as StoreInput,
        user.role
      );

      if (!updatedStore) {
        return reply
          .status(404)
          .send({ status: 404, message: "Store not found" });
      }

      return reply.status(200).send({
        status: 200,
        message: "Store updated successfully",
        result: updatedStore,
      });
    } catch (err: any) {
      return reply.status(500).send({
        status: 500,
        message: err.message || "Update failed",
      });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as { id: string };

      await storeService.deleteStore(id, user.role);

      reply.status(200).send({
        status: 200,
        message: "Store deleted successfully",
      });
    } catch (err: any) {
      reply.status(500).send({
        status: 500,
        message: err.message || "Failed to delete store",
      });
    }
  },
};
