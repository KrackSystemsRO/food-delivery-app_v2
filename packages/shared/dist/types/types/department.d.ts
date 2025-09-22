import type { CompanyType } from "./company";
import type { UserType } from "./user";
interface BaseDepartment {
    name: string;
    description?: string;
    is_active: boolean;
    admin: UserType[];
    company: Partial<CompanyType>[];
}
export interface DepartmentType extends BaseDepartment {
    _id: string;
    createdAt: string;
    updatedAt: string;
    departmentId: number;
    __v: number;
}
export interface DepartmentForm extends BaseDepartment {
}
export {};
