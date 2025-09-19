import type { CompanyType } from "./company";
import type { UserType } from "./user";

// --- Base interface with shared fields ---
interface BaseDepartment {
  name: string;
  description?: string;
  is_active: boolean;
  admin: UserType[];
  company: Partial<CompanyType>[]; // still partial because forms & DB both accept partial companies
}

// --- Main interfaces ---

export interface DepartmentType extends BaseDepartment {
  _id: string;
  createdAt: string;
  updatedAt: string;
  departmentId: number;
  __v: number;
}

export interface DepartmentForm extends BaseDepartment {}
