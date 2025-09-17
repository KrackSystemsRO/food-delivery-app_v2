import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { Server as SocketIOServer } from "socket.io";
import { registerSocketHandlers } from "../services/soket.connection/socketService";

async function socketIOPlugin(fastify: FastifyInstance) {
  const io = new SocketIOServer(fastify.server, {
    cors: { origin: "*" },
  });

  fastify.decorate("io", io);

  registerSocketHandlers(io);
}

export default fp(socketIOPlugin);
