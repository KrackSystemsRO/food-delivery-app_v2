import authorizedAxios from "@/utils/request/authorizedRequest";
import type { Types } from "@my-monorepo/shared";

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

export const getDepartments = async (
  params: GetDepartmentParams
): Promise<GetDepartmentsResponse> => {
  try {
    const response = await authorizedAxios.get("/department", {
      params: {
        search: params.search,
        is_active: params.is_active,
        company: params.company,
        page: params.page,
        limit: params.limit,
        sort_by: params.sort_by,
        order: params.order,
      },
    });

    return {
      result: response.data.result,
      status: response.status,
      message: response.data.message,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  } catch (error: any) {
    console.error("Failed to fetch departments:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch departments",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addDepartment = async (data: Types.Department.DepartmentForm) => {
  try {
    const response = await authorizedAxios.post(`department`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to create department");
    return error;
  }
};

export const updateDepartment = async (
  id: string,
  data: Types.Department.DepartmentForm
) => {
  try {
    const response = await authorizedAxios.put(`department/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to update department");
    return error;
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`department/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete department");
    return error;
  }
};
