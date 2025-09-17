import { type FastifyRequest } from "fastify";

export type StoreDeleteRequest = FastifyRequest<{
  Params: {
    id: string; // store ID
  };
}>;

export type StoreReadRequest = FastifyRequest<{
  Params: {
    id: string; // store ID
  };
}>;
