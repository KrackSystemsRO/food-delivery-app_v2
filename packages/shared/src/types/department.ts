import { CompanyType } from "./company";
import { UserType } from "./user";

export interface DepartmentType {
  _id: string;
  name: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  description: string;
  departmentId: number;
  __v: number;
  admin: UserType[];
  company: Partial<CompanyType>[];
}

export interface DepartmentForm {
  name: string;
  description?: string;
  is_active: boolean;
  company: CompanyType[];
  admin: UserType[];
}
