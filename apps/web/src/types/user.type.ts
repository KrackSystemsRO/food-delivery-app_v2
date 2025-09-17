import type { CompanyType } from "./company.type";
import type { DepartmentType } from "./department.type";

export interface UserType {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  phone_number: string;
  company: CompanyType[];
  department: DepartmentType[];
  deliveryLocations: string[];
  is_active: Boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  __v: number;
}

export interface UserResponseType {
  status: number;
  result: UserType;
  message: string;
}
