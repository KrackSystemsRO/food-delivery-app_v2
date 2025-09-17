import { CompanyType } from "./company.type";
import { UserType } from "./user.type";

export interface StoreType {
  _id: string;
  storeId: number;

  company?: CompanyType[]; // or a populated CompanyType[] if you return full objects
  admin?: UserType[]; // or a populated UserType[] if you return full objects

  name: string;
  type: "RESTAURANT" | "GROCERY" | "BAKERY" | "CAFE" | "OTHER";
  phone_number?: string;
  description?: string;

  address: string;

  location?: {
    lat?: number;
    lng?: number;
  };

  cityId: string;
  zoneId: string;

  is_open: boolean;
  is_active: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface StoreListQuery {
  search?: string;
  type?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: "asc" | "desc";
  is_active?: boolean;
  is_open?: boolean;
  company?: string;
}
