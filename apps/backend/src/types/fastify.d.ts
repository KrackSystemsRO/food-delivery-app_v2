import { Server as SocketIOServer } from "socket.io";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
    io: SocketIOServer;
    orderService: {
      getPreparedOrders: () => Promise<any[]>;
      getAllOrders: () => Promise<any[]>;
    };
  }
}
