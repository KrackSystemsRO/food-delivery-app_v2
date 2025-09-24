// libs/deliveryLocation.routes.ts
import { type FastifyInstance } from "fastify";
import deliveryLocationController from "@/controllers/deliveryLocations.controller";

export default function (
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void
) {
  fastify.get("/", {
    preHandler: fastify.authenticate,
    handler: deliveryLocationController.list,
  });

  fastify.get("/:locationId", {
    preHandler: fastify.authenticate,
    handler: deliveryLocationController.read,
  });

  fastify.post("/", {
    preHandler: fastify.authenticate,
    handler: deliveryLocationController.create,
  });

  fastify.put("/:locationId", {
    preHandler: fastify.authenticate,
    handler: deliveryLocationController.update,
  });

  fastify.delete("/:locationId", {
    preHandler: fastify.authenticate,
    handler: deliveryLocationController.delete,
  });

  done();
}
