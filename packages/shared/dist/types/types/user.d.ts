import { Date, Types } from "mongoose";
import { CompanyType } from "./company";
import { DepartmentType } from "./department";
import { DeliveryLocation } from "./deliveryLocation";
interface BaseUser {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}
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
    phone_number?: string;
    company?: CompanyType[];
    department?: DepartmentType[];
    deliveryLocations?: string[];
}
export interface UserResponseType {
    status: number;
    result: UserType;
}
export interface UserFiltersType {
    search: string;
    role: string;
    is_active?: boolean;
    limit: number;
}
export {};
