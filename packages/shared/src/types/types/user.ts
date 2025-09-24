import { Date, Types } from "mongoose";

import { CompanyType } from "./company";
import { DepartmentType } from "./department";
import { DeliveryLocation } from "./deliveryLocation";
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
  _id: string | Types.ObjectId;
  phone_number?: string | null;
  password?: string;
  company: CompanyType[];
  department: DepartmentType[];
  deliveryLocations: DeliveryLocation[];
  createdAt: string | Date;
  updatedAt: string | Date;
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
