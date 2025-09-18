import { UserForm, UserType } from "../../types/types/user";
import type { AxiosInstance } from "axios";
interface GetUsersParams {
    search?: string;
    role?: string;
    is_active?: boolean | undefined;
    page?: number;
    limit?: number;
    sort_by?: string;
    order?: "asc" | "desc";
}
interface GetUsersResponse {
    result: UserType[];
    status: number;
    message?: string;
    totalCount?: number;
    totalPages?: number;
    currentPage?: number;
}
export declare const getUserDetails: (axios: AxiosInstance) => Promise<any>;
export declare const getUsers: (axios: AxiosInstance, params: GetUsersParams) => Promise<GetUsersResponse>;
export declare const addUser: (axios: AxiosInstance, data: UserForm) => Promise<any>;
export declare const updateUser: (axios: AxiosInstance, id: string, data: UserForm) => Promise<any>;
export declare const deleteUser: (axios: AxiosInstance, id: string) => Promise<any>;
export {};
