// libs
import { type FastifyInstance } from "fastify";
// services
import controller from "@/controllers/order.controller";

export default function (
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void
) {
  fastify.get("/", {
    preHandler: fastify.authenticate,
    handler: controller.list,
  });

  fastify.get("/:id", {
    preHandler: fastify.authenticate,
    handler: controller.read,
  });

  fastify.post("/", {
    preHandler: fastify.authenticate,
    handler: controller.create,
  });

  fastify.put("/:id", {
    preHandler: fastify.authenticate,
    handler: controller.update,
  });

  fastify.delete("/:id", {
    preHandler: fastify.authenticate,
    handler: controller.delete,
  });

  fastify.post("/accept-order", {
    preHandler: fastify.authenticate,
    handler: controller.accept,
  });

  fastify.post("/deny-order", {
    preHandler: fastify.authenticate,
    handler: controller.deny,
  });

  fastify.post("/get-store", {
    preHandler: fastify.authenticate,
    handler: controller.getOrdersByStores,
  });

  done();
}
