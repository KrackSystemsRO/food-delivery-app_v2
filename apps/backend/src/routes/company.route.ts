// libs
import { type FastifyInstance } from "fastify";
// services
import controller from "@/controllers/company.controller";

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

  done();
}
