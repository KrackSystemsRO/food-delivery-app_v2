import type { CompanyType } from "./company.type";
import type { UserType } from "@/types/user.type";

// export interface DepartmentType {
//   _id: string;
//   name: string;
//   is_active: boolean;
//   createdAt: string;
//   updatedAt: string;
//   departmentId: number;
//   __v: number;
//   admin: any[];
//   company: Partial<CompanyType>[];
// }

export interface DepartmentType {
  _id: string;
  company: CompanyType[];
  admin: UserType[];
  name: string;
  description?: string;
  is_active: boolean;
  departmentId: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentForm {
  name: string;
  description?: string;
  is_active: boolean;
  company: CompanyType[];
  admin: UserType[];
}
