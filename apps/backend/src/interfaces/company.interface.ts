import { type FastifyRequest } from "fastify";
import mongoose from "mongoose";

export type UpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: Partial<{
    admin: string[];
    company: string[];
    ticket: string[];
    name: string;
    bg_image: string;
    target: object;
    is_active: boolean;
    create: boolean;
    update: boolean;
  }>;
}>;

export interface CompanyFilter {
  _id?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
  name?: { $regex: string; $options: string };
  type?: string;
  is_active?: boolean;
  admin?: string;
}
