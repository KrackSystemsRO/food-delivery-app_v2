import { CompanyType } from "./company";
import { DepartmentType } from "./department";

// --- Base Interface ---
// Common fields for UserType and UserForm
interface BaseUser {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

// --- Main Interfaces ---

export interface UserType extends BaseUser {
  _id: string;
  phone_number: string;
  company: CompanyType[];
  department: DepartmentType[];
  deliveryLocations: string[];
  createdAt: string;
  updatedAt: string;
  userId: number;
  cityId: string;
  zoneId: string;
  is_active: boolean;
  __v: number;
}

export interface UserForm extends BaseUser {
  // Include optional fields used during creation/update if needed
  phone_number?: string;
  company?: CompanyType[];
  department?: DepartmentType[];
  deliveryLocations?: string[];
}

// --- Response Types ---

export interface UserResponseType {
  status: number;
  result: UserType;
}

// --- Filters for API queries ---

export interface UserFiltersType {
  search: string;
  role: string;
  is_active?: boolean;
  limit: number;
}
