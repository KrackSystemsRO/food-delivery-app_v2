import type { AxiosInstance } from "axios";
import type { Types } from "../../index";
export interface GetCompanyParams {
    search?: string;
    type?: "CLIENT" | "PROVIDER" | "";
    is_active?: boolean;
    page?: number;
    limit?: number;
    sort_by?: keyof Types.Company.CompanyType;
    order?: "asc" | "desc";
}
export interface GetCompaniesResponse {
    status: number;
    message: string;
    result: Types.Company.CompanyType[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}
export declare const getCompanies: (axios: AxiosInstance, params: GetCompanyParams) => Promise<GetCompaniesResponse>;
export declare const addCompany: (axios: AxiosInstance, data: Types.Company.CompanyForm) => Promise<any>;
export declare const updateCompany: (axios: AxiosInstance, id: string, data: Types.Company.CompanyForm) => Promise<any>;
export declare const deleteCompany: (axios: AxiosInstance, id: string) => Promise<any>;
