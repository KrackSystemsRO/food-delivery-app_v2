// libs
import { type FastifyInstance } from "fastify";
// services
import controller from "@/controllers/cart.controller";

export default function (
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void
) {
  fastify.post("/up", {
    preHandler: fastify.authenticate,
    handler: controller.upsert,
  });

  fastify.get("/", {
    preHandler: fastify.authenticate,
    handler: controller.read,
  });

  fastify.delete("/item/:productId", {
    preHandler: fastify.authenticate,
    handler: controller.removeItem,
  });

  fastify.delete("/", {
    preHandler: fastify.authenticate,
    handler: controller.clear,
  });

  done();
}
