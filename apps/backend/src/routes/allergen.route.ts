// libs
import { type FastifyInstance } from "fastify";
// services
import controller from "@/controllers/allergen.controller";

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
    schema: {
      summary: "Create allergen",
      tags: ["Allergen"],
      body: {
        type: "object",
        properties: {
          name: { type: "string", example: "Name create" },
          address: { type: "string", example: "Address create" },
          type: { type: "string", example: "CLIENT" },
          email: { type: "string", example: "email.create@food-delivery.com" },
          is_active: { type: "boolean", example: true },
          phone_number: { type: "string", example: "0724511622" },
        },
      },
      response: {
        200: { $ref: "AllergenResponse#" },
      },
    },
    handler: controller.create,
  });

  fastify.put("/:id", {
    preHandler: fastify.authenticate,
    schema: {
      summary: "Update allergen by ID",
      tags: ["Allergen"],
      body: {
        type: "object",
        properties: {
          name: { type: "string", example: "Name update" },
          address: { type: "string", example: "Address update" },
          type: { type: "string", example: "CLIENT" },
          email: { type: "string", example: "email.update@food-delivery.com" },
          is_active: { type: "boolean", example: true },
          phone_number: { type: "string", example: "0724511622" },
        },
      },
      response: {
        200: { $ref: "AllergenResponse#" },
      },
    },
    handler: controller.update,
  });

  fastify.delete("/:id", {
    preHandler: fastify.authenticate,
    // schema: {
    //   summary: "Delete allergen by ID",
    //   tags: ["Allergen"],
    //   response: {
    //     200: {
    //       type: "object",
    //       properties: {
    //         status: { type: "number", example: 200 },
    //         message: {
    //           type: "string",
    //           example: "Allergen deleted successfully!",
    //         },
    //       },
    //     },
    //   },
    // },
    handler: controller.delete,
  });

  done();
}
