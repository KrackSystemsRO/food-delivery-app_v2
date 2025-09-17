import fp from "fastify-plugin";
import rateLimit from "@fastify/rate-limit";
import Redis from "ioredis";
import { config } from "dotenv";

config();

export default fp(async (fastify) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  });
  fastify.register(rateLimit, {
    global: true,
    max: 1000,
    timeWindow: "1 minute",
    redis,
    ban: 3,
    keyGenerator: (req) => req.ip,
    errorResponseBuilder: (_req, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded. Try again in ${context.after}.`,
    }),
    addHeaders: {
      "x-ratelimit-limit": true,
      "x-ratelimit-remaining": true,
      "x-ratelimit-reset": true,
    },
  });
});
