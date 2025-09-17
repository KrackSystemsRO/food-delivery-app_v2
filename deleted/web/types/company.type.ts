import type { UserType } from "./user.type";

export interface CompanyAdmin {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CompanyType {
  _id: string;
  companyId?: number;
  name: string;
  address?: string;
  type?: "PROVIDER" | "CLIENT";
  email?: string;
  is_active: boolean;
  phone_number?: string;
  admin: UserType[];
  createdAt: string;
  updatedAt: string;
}

export interface CompanyForm {
  name: string;
  address?: string;
  type?: "PROVIDER" | "CLIENT";
  email?: string;
  phone_number?: string;
  is_active: boolean;
  admin: UserType[];
}
