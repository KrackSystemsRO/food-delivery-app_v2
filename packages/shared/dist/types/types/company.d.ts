import { UserType } from "./user";
export interface CompanyType {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    address: string;
    type: "PROVIDER" | "CLIENT" | undefined;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    companyId: number;
    __v: number;
    admin: UserType[];
}
export interface CompanyForm {
    name: string;
    address?: string;
    type?: "PROVIDER" | "CLIENT";
    email?: string;
    phone_number?: string;
    is_active: boolean;
    admin: UserType[];
}
