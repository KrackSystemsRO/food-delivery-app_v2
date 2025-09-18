import { Types } from "../../index";
import { CompanyType } from "./company";
import { UserType } from "./user";
export interface StoreType {
    _id: string;
    storeId: number;
    company?: CompanyType[];
    admin?: UserType[];
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
