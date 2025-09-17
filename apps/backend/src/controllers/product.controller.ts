import { FastifyRequest, FastifyReply } from "fastify";
import * as productService from "@/services/product.service";
import { getUserFromRequest } from "@/utils/auth.helpers";

const productController = {
  create: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const product = await productService.createProduct(
        request.body as productService.CreateProductData,
        user.role
      );

      return reply.status(201).send({
        status: 201,
        message: "Product created successfully!",
        result: product,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  read: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      const product = await productService.getProduct(id, user.role);

      if (!product) {
        return reply.status(404).send({
          status: 404,
          message: "Product not found",
        });
      }

      return reply.status(200).send({ status: 200, result: product });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  list: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const query = request.query as any;
      const result = await productService.listProducts(query, user.role);

      return reply.status(200).send({
        status: 200,
        message: "Products fetched successfully!",
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
      const updatedProduct = await productService.updateProduct(
        id,
        request.body as any,
        user.role
      );

      if (!updatedProduct) {
        return reply.status(404).send({
          status: 404,
          message: "Product not found",
        });
      }

      return reply.status(200).send({
        status: 200,
        message: "Product updated successfully!",
        result: updatedProduct,
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },

  delete: async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await getUserFromRequest(request, reply);

      const { id } = request.params as { id: string };
      await productService.deleteProduct(id, user.role);

      return reply.status(200).send({
        status: 200,
        message: "Product deleted successfully!",
      });
    } catch (err: any) {
      return reply.status(500).send({ status: 500, message: err.message });
    }
  },
};

export default productController;
