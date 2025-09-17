import type { CompanyType } from "./company.type";
import type { UserType } from "./user.type";

export interface StoreType {
  _id: string;
  storeId: number;
  name: string;
  type: "RESTAURANT" | "GROCERY" | "BAKERY" | "CAFE" | "OTHER";
  description?: string;
  address: string;
  company: CompanyType[];
  admin: UserType[];
  location?: {
    lat?: number;
    lng?: number;
  };
  is_active: boolean;
  is_open: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  phone_number?: string;
}

export interface StoreForm {
  _id?: string;
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
