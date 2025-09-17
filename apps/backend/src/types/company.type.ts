import { type FastifyRequest } from "fastify";

export type CompanyDeleteRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export type CompanyReadRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;
