import { FastifyRequest, FastifyReply } from "fastify";
import * as allergenService from "@/services/allergen.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const allergenController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { name, description, is_active } = request.body as any;

      if (!name)
        return reply
          .status(400)
          .send({ status: 400, message: "Name is required" });

      const result = await allergenService.createAllergen({
        name,
        description,
        isActive: is_active,
        role: user.role,
      });

      return reply.status(201).send({
        status: 201,
        message: "Allergen created successfully",
        result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;

      const result = await allergenService.readAllergen(id, user.role);
      return reply.status(200).send({ status: 200, result });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  update: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;
      const updateData = request.body as any;

      const result = await allergenService.updateAllergen({
        id,
        updateData,
        role: user.role,
      });
      return reply.status(200).send({
        status: 200,
        message: "Allergen updated successfully",
        result,
      });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;

      await allergenService.deleteAllergen(id, user.role);
      return reply
        .status(200)
        .send({ status: 200, message: "Allergen deleted successfully" });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { search, is_active, page, limit, sort_by, order } =
        request.query as any;

      const result = await allergenService.listAllergens({
        role: user.role,
        search,
        isActive: is_active === undefined ? undefined : is_active === "true",
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        sortBy: sort_by,
        order,
      });

      return reply.status(200).send({
        status: 200,
        message: "Allergens fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};

export default allergenController;
