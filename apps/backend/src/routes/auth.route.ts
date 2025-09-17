// libs
import { type FastifyInstance } from "fastify";
// services
import controller from "@/controllers/user.controller";

export default function (
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void
) {
  fastify.post("/login", {
    handler: controller.login,
  });

  fastify.post("/logout", {
    handler: controller.logout,
  });

  fastify.post("/register", {
    handler: controller.register,
  });

  fastify.get("/refresh-token", {
    handler: controller.refreshToken,
  });

  fastify.post("/forgot-password", {
    handler: controller.forgotPassword,
  });

  fastify.post("/reset-password", {
    handler: controller.resetPassword,
  });

  fastify.get("/users", {
    preHandler: fastify.authenticate,
    handler: controller.listAll,
  });

  fastify.get("/user", {
    preHandler: fastify.authenticate,
    handler: controller.getUserDetails,
  });

  fastify.put("/user", {
    preHandler: fastify.authenticate,
    handler: controller.updateUser,
  });

  fastify.post("/user", {
    preHandler: fastify.authenticate,
    handler: controller.createUser,
  });

  fastify.put("/user/:id", {
    preHandler: fastify.authenticate,
    handler: controller.updateUser,
  });

  fastify.delete("/user/:id", {
    preHandler: fastify.authenticate,
    handler: controller.deleteUser,
  });

  done();
}
