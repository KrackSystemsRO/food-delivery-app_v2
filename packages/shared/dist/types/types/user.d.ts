import { CompanyType } from "./company";
import { DepartmentType } from "./department";
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
    createdAt: string;
    updatedAt: string;
    userId: number;
    cityId: string;
    zoneId: string;
    is_active: boolean;
    __v: number;
}
export interface UserResponseType {
    status: number;
    result: UserType;
}
export interface UserForm {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}
export interface UserFiltersType {
    search: string;
    role: string;
    is_active?: boolean;
    limit: number;
}
