import authorizedAxios from "@/utils/request/authorizedRequest";
import type { Types } from "@my-monorepo/shared";

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

export const getCompanies = async (
  params: GetCompanyParams
): Promise<GetCompaniesResponse> => {
  try {
    const response = await authorizedAxios.get("/company", {
      params: {
        search: params.search,
        type: params.type,
        is_active: params.is_active,
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
    console.error("Failed to fetch company:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch company",
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
};

export const addCompany = async (data: Types.Company.CompanyForm) => {
  try {
    const response = await authorizedAxios.post(`company`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to create company");
    return error;
  }
};

export const updateCompany = async (
  id: string,
  data: Types.Company.CompanyForm
) => {
  try {
    const response = await authorizedAxios.put(`company/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to delete company");
    return error;
  }
};

export const deleteCompany = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`company/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete company");
    return error;
  }
};
