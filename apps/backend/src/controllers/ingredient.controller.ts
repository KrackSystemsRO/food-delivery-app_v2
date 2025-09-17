// controllers/ingredient.controller.ts
import { FastifyRequest, FastifyReply } from "fastify";
import * as ingredientService from "@/services/ingredient.service";
import { getUserFromRequest } from "@/utils/auth.helpers";
import { checkPermissionOrThrow } from "@/utils/permissions.helpers";

const ingredientController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      checkPermissionOrThrow(user.role, "create", "ingredients");

      const ingredient = await ingredientService.createIngredient(
        request.body as any
      );

      return reply.status(201).send({
        status: 201,
        message: "Ingredient created successfully",
        result: ingredient,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      const ingredient = await ingredientService.getIngredient(id, user.role);

      if (!ingredient)
        return reply
          .status(404)
          .send({ status: 404, message: "Ingredient not found" });

      return reply.status(200).send({ status: 200, result: ingredient });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const query = request.query as {
        search?: string;
        page?: string;
        limit?: string;
        sort_by?: string;
        order?: "asc" | "desc";
        is_active?: string;
      };

      const result = await ingredientService.listIngredients(
        {
          search: query.search,
          page: query.page ? parseInt(query.page) : 1,
          limit: query.limit ? parseInt(query.limit) : 10,
          sortBy: query.sort_by,
          order: query.order,
          is_active:
            query.is_active !== undefined
              ? query.is_active === "true"
              : undefined,
        },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Ingredients fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      checkPermissionOrThrow(user.role, "update", "ingredients");

      const { id } = request.params as { id: string };
      const updated = await ingredientService.updateIngredient(
        id,
        user.role,
        request.body as any
      );

      if (!updated)
        return reply
          .status(404)
          .send({ status: 404, message: "Ingredient not found" });

      return reply.status(200).send({
        status: 200,
        message: "Ingredient updated successfully",
        result: updated,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      checkPermissionOrThrow(user.role, "delete", "ingredients");

      const { id } = request.params as { id: string };
      await ingredientService.deleteIngredient(id, user.role);

      return reply.status(200).send({
        status: 200,
        message: "Ingredient deleted successfully",
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  check: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      checkPermissionOrThrow(user.role, "read", "ingredients");
      const { name } = request.query as { name?: string };

      if (!name)
        return reply
          .status(400)
          .send({ status: 400, message: "Missing name parameter" });

      const result = await ingredientService.checkIngredientExists(name);
      return reply.status(200).send({ status: 200, ...result });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};

export default ingredientController;
