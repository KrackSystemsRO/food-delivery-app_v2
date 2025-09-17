import { CompanyType } from "./company";

export interface DepartmentType {
  _id: string;
  name: string;
  is_active: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  departmentId: number;
  __v: number;
  admin: any[]; // Replace with actual admin type if available
  company: Partial<CompanyType>[]; // Minimal company with is_active in your response
}
