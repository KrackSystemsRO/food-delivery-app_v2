import {
  FastifyPluginAsync,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const authenticationPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        let token: string | undefined;

        // First try Authorization header
        const authHeader = request.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }

        // Then try cookie if Authorization header isn't present
        if (
          (!token && request.cookies?.accessToken) ||
          request.cookies?.access_token
        ) {
          token = request.cookies?.accessToken || request.cookies?.access_token;
        }

        if (!token) {
          return reply
            .status(401)
            .send({ message: "Missing or invalid Authorization token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        request["user"] = decoded;
      } catch (err) {
        return reply.status(401).send({ error: err.message });
      }
    }
  );
};

export default fp(authenticationPlugin);
