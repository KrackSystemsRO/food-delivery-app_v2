import authorizedAxios from "@/utils/request/authorizedRequest";
import type { Types } from "@my-monorepo/shared";

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
  result: Types.User.UserType[];
  status: number;
  message?: string;
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
}

export const getUserDetails = async () => {
  try {
    const response = await authorizedAxios.get("/user");
    return response.data;
  } catch (error) {
    console.info("You are not logged in yet.");
    return error;
  }
};

export const getUsers = async (
  params: GetUsersParams
): Promise<GetUsersResponse> => {
  try {
    const response = await authorizedAxios.get("/users", {
      params: {
        search: params.search,
        role: params.role,
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
    console.error("Failed to fetch users:", error);
    return {
      result: [],
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch users",
    };
  }
};

export const addUser = async (data: Types.User.UserForm) => {
  try {
    const response = await authorizedAxios.post(`user`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to create user");
    return error;
  }
};

export const updateUser = async (id: string, data: Types.User.UserForm) => {
  try {
    const response = await authorizedAxios.put(`user/${id}`, data);
    return response.data;
  } catch (error) {
    console.info("Failed to delete user");
    return error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`user/${id}`);
    return response.data;
  } catch (error) {
    console.info("Failed to delete user");
    return error;
  }
};
