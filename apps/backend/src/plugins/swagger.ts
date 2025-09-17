// libs
import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { config } from "dotenv";

config();

export default fp(async (fastify, opts) => {
  if (process.env.APP_ENV === "production") return;

  await fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Food Delivery API",
        description: "API documentation for the food delivery platform",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:8081",
        },
      ],
      tags: [
        { name: "Auth", description: "Auth-related endpoints" },
        { name: "Company", description: "Company-related endpoints" },
        { name: "Department", description: "Department-related endpoints" },
        { name: "User", description: "User-related endpoints" },
        { name: "Restaurant", description: "Restaurant-related endpoints" },
      ],
      components: {
        securitySchemes: {
          Bearer: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          Bearer: [],
        },
      ],
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: "/api/v1/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  fastify.log.info("Swagger UI available at /api/v1/docs");
});
