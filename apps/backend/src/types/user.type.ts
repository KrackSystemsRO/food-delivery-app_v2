import { Types } from "mongoose";

export type UserType = {
  _id?: string | Types.ObjectId;
  userId?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  is_active?: boolean;
  password: string;
  role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "CLIENT" | "COURIER";
  company?: Types.ObjectId[];
  department?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
};
