import { Types } from "../../index";
import { CompanyType } from "./company";
import { UserType } from "./user";

// --- Base Interface ---
// Common fields shared by StoreType and StoreForm
interface BaseStore {
  name: string;
  type: "RESTAURANT" | "GROCERY" | "BAKERY" | "CAFE" | "OTHER";
  address: string;
  phone_number?: string;
  description?: string;
  is_active: boolean;
  is_open: boolean;
  company: CompanyType[];
  admin: UserType[];
  location?: {
    lat?: number;
    lng?: number;
  };
}

// --- Main Interfaces ---

export interface StoreType extends BaseStore {
  _id: string;
  storeId: number;
  cityId: string;
  zoneId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreForm extends BaseStore {
  _id?: string; // optional when creating a new store
}

// --- Query Parameters ---

export interface StoreListQuery {
  search?: string;
  company?: string;
  admin?: string;
  type?: string;
  is_active?: boolean;
  is_open?: boolean;
  page?: number;
  limit?: number;
  sort_by?: keyof Types.Store.StoreType;
  order?: "asc" | "desc";
}
