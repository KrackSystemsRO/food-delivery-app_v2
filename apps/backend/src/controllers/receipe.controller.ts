// libs
import { type FastifyReply, type FastifyRequest } from "fastify";
// utils & permissions
import { getUserFromRequest } from "@/utils/auth.helpers";
import * as receipesService from "@/services/receipes.service";

export default {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, ingredients } = request.body as {
        name: string;
        description?: string;
        ingredients?: { ingredient: string; quantity?: string }[];
      };

      const user = await getUserFromRequest(request, reply);
      if (!user) return;

      const receipes = await receipesService.createReceipes(
        { name, description, ingredients },
        user.role
      );

      return reply.status(201).send({
        status: 201,
        message: "Receipes created successfully",
        result: receipes,
      });
    } catch (err: any) {
      const status = err.message.includes("exists") ? 409 : 400;
      return reply.status(status).send({
        status,
        message: err.message || "Something went wrong",
      });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const user = await getUserFromRequest(request, reply);
      if (!user) return;

      const receipes = await receipesService.getReceipes(id, user.role);

      return reply.status(200).send({ status: 200, result: receipes });
    } catch (err: any) {
      const status = err.message === "Receipes not found" ? 404 : 500;
      return reply.status(status).send({ status, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      if (!user) return;

      const {
        search,
        page = "1",
        limit = "10",
        sort_by = "createdAt",
        order = "asc",
        is_active,
      } = request.query as Record<string, string>;

      const result = await receipesService.listReceipes(
        {
          search,
          page: parseInt(page),
          limit: parseInt(limit),
          sort_by,
          order: order as "asc" | "desc",
          is_active:
            is_active === "true"
              ? true
              : is_active === "false"
              ? false
              : undefined,
        },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Receipes fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as {
        name?: string;
        description?: string;
        ingredients?: { ingredient: string; quantity?: string }[];
      };

      const user = await getUserFromRequest(request, reply);
      if (!user) return;

      const updated = await receipesService.updateReceipes(
        id,
        updateData,
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Receipes updated successfully",
        result: updated,
      });
    } catch (err: any) {
      const status = err.message === "Receipes not found" ? 404 : 400;
      return reply.status(status).send({ status, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const user = await getUserFromRequest(request, reply);
      if (!user) return;

      await receipesService.deleteReceipes(id, user.role);

      return reply.status(200).send({
        status: 200,
        message: "Receipes deleted successfully",
      });
    } catch (err: any) {
      const status = err.message === "Receipes not found" ? 404 : 500;
      return reply.status(status).send({ status, message: err.message });
    }
  },
};
