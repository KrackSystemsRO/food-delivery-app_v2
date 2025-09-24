import Fastify from "fastify";
import compress from "@fastify/compress";
import fastifyCookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import multipart, { ajvFilePlugin } from "@fastify/multipart";
import fastifyCors from "@fastify/cors";

// plugins
import rateLimit from "./plugins/rateLimit";
import mongoosePlugin from "./plugins/mongoose";
import socketIOPlugin from "./plugins/socketio";
import swaggerPlugin from "./plugins/swagger";
import authenticationPlugin from "./plugins/authentication";

// schemas
import schemas from "@/models/schemas.swagger";
import { initSockets } from "@/sockets";

const buildApp = async () => {
  const fastify = Fastify({
    logger: process.env.APP_MODE !== "production",
    ajv: {
      plugins: [ajvFilePlugin],
      customOptions: {
        strict: false,
        keywords: ["api"],
      },
    },
    bodyLimit: 2 * 1024 * 1024 * 1024,
  });

  // Register schemas
  Object.values(schemas).forEach((schema) => fastify.addSchema(schema));

  // Register plugins
  await fastify.register(fastifyCors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
  await fastify.register(fastifyCookie, {
    parseOptions: {},
    secret: process.env.JWT_SECRET || undefined,
  });

  await fastify.register(swaggerPlugin);
  await fastify.register(rateLimit);
  await fastify.register(mongoosePlugin);
  // await fastify.register(socketIOPlugin);
  const io = initSockets(fastify.server);
  fastify.decorate("io", io);
  await fastify.register(helmet);
  await fastify.register(compress);
  await fastify.register(authenticationPlugin);

  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
    attachFieldsToBody: true,
  });

  // Root route
  fastify.get("/", async (req, reply) => {
    return { status: "ok" };
  });
  fastify.get("/api/v1/test-cookie", async (request, reply) => {
    console.log("Cookies received:", request.cookies);
    return { cookies: request.cookies };
  });

  // Routes
  fastify.register(require("./routes/auth.route").default, {
    prefix: "/api/v1",
  });
  fastify.register(require("./routes/company.route").default, {
    prefix: "/api/v1/company",
  });
  fastify.register(require("./routes/department.route").default, {
    prefix: "/api/v1/department",
  });
  fastify.register(require("./routes/store.route").default, {
    prefix: "/api/v1/store",
  });
  fastify.register(require("./routes/product.route").default, {
    prefix: "/api/v1/product",
  });
  fastify.register(require("./routes/order.route").default, {
    prefix: "/api/v1/order",
  });
  fastify.register(require("./routes/cart.route").default, {
    prefix: "/api/v1/cart",
  });
  fastify.register(require("./routes/allergen.route").default, {
    prefix: "/api/v1/allergen",
  });
  fastify.register(require("./routes/category.route").default, {
    prefix: "/api/v1/category",
  });
  fastify.register(require("./routes/receipe.route").default, {
    prefix: "/api/v1/recipe",
  });
  fastify.register(require("./routes/ingredient.route").default, {
    prefix: "/api/v1/ingredient",
  });
  fastify.register(require("./routes/deliveryLocation.route").default, {
    prefix: "/api/v1/locations",
  });

  await fastify.ready();

  return fastify;
};

export default buildApp;
