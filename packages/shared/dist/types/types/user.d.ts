import { CompanyType } from "./company";
import { DepartmentType } from "./department";
interface BaseUser {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}
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
