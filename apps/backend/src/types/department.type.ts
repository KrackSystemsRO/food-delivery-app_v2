import { type FastifyRequest } from "fastify";

export type DepartmentDeleteRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export type DepartmentReadRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;
