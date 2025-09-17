import { type FastifyRequest } from "fastify";
import mongoose from "mongoose";

export interface StoreListQuery {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
  is_active?: boolean;
  is_open?: boolean;
  company?: string;
}

export interface StoreInput {
  company: string;
  admin?: string;
  type: "RESTAURANT" | "GROCERY" | "BAKERY" | "CAFE" | "OTHER";
  name: string;
  description?: string;
  address: string;
  phone_number: string;
  is_active?: boolean;
  is_open?: boolean;
}

export type UpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: Partial<{
    admin: string[];
    company: string;
    ticket: string[];
    name: string;
    bg_image: string;
    target: object;
    address: string;
    phone_number: string;
    is_active: boolean;
    is_open: boolean;
    create: boolean;
    update: boolean;
  }>;
}>;

export interface StoreFilter {
  _id?: mongoose.Types.ObjectId | { $in: mongoose.Types.ObjectId[] };
  company?: string | { $in: string[] };
  name?: { $regex: string; $options: string };
  address?: string;
  is_open?: boolean;
  is_active?: boolean;
}
