import type { Types } from "../../index";
import type { AxiosInstance } from "axios";
export interface GetDepartmentParams {
    search?: string;
    is_active?: boolean;
    page?: number;
    company: string;
    limit?: number;
    sort_by?: keyof Types.Department.DepartmentType;
    order?: "asc" | "desc";
}
export interface GetDepartmentsResponse {
    status: number;
    message: string;
    result: Types.Department.DepartmentType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getDepartments: (axios: AxiosInstance, params: GetDepartmentParams) => Promise<GetDepartmentsResponse>;
export declare const addDepartment: (axios: AxiosInstance, data: Types.Department.DepartmentForm) => unknown;
export declare const updateDepartment: (axios: AxiosInstance, id: string, data: Types.Department.DepartmentForm) => unknown;
export declare const deleteDepartment: (axios: AxiosInstance, id: string) => unknown;
