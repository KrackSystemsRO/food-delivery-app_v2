import type { UserType } from "./user";

// --- Base interface with fields shared by both ---
interface BaseCompany {
  name: string;
  address?: string;
  type?: "PROVIDER" | "CLIENT" | undefined;
  email?: string;
  phone_number?: string;
  is_active: boolean;
  admin: UserType[];
}

// --- Main interfaces ---

export interface CompanyType extends BaseCompany {
  _id: string;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  __v: number;
}

export interface CompanyForm extends BaseCompany {}
