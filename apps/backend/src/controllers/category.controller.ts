import { FastifyRequest, FastifyReply } from "fastify";
import * as categoryService from "@/services/category.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const categoryController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { name, description } = request.body as any;

      if (!name)
        return reply
          .status(400)
          .send({ status: 400, message: "Name is required" });

      const result = await categoryService.createCategory({
        name,
        description,
        role: user.role,
      });
      return reply.status(201).send({
        status: 201,
        message: "Category created successfully",
        result,
      });
    } catch (err: any) {
      return reply.status(400).send({ status: 400, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { id } = request.params as any;

      const result = await categoryService.readCategory(id, user.role);
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

      const result = await categoryService.updateCategory({
        id,
        updateData,
        role: user.role,
      });
      return reply.status(200).send({
        status: 200,
        message: "Category updated successfully",
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

      await categoryService.deleteCategory(id, user.role);
      return reply
        .status(200)
        .send({ status: 200, message: "Category deleted successfully" });
    } catch (err: any) {
      return reply.status(404).send({ status: 404, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);
      const { search, page, limit, sort_by, order } = request.query as any;

      const result = await categoryService.listCategories(
        {
          search,
          page: page ? parseInt(page) : 1,
          limit: limit ? parseInt(limit) : 10,
          sortBy: sort_by,
          order,
        },
        user.role
      );

      return reply.status(200).send({
        status: 200,
        message: "Categories fetched successfully",
        ...result,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};
export default categoryController;
