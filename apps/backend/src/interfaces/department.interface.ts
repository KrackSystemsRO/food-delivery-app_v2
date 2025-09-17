import { type FastifyRequest } from "fastify";

export type UpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: Partial<{
    admin: string[];
    company: string[];
    name: string;
    is_active: boolean;
    create: boolean;
    update: boolean;
  }>;
}>;
