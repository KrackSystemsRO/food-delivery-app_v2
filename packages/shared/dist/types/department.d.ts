import { CompanyType } from "./company";
export interface DepartmentType {
    _id: string;
    name: string;
    is_active: boolean;
    createdAt: string;
    updatedAt: string;
    departmentId: number;
    __v: number;
    admin: any[];
    company: Partial<CompanyType>[];
}
