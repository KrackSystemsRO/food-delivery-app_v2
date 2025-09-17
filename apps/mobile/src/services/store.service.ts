import { StoreListQuery } from "@/types/store.type";
import authorizedAxios from "../utils/request/authorizedRequest";

export const getListStore = async (params: StoreListQuery) => {
  try {
    const response = await authorizedAxios.get("/store", { params });
    return response.data;
  } catch (error) {
    console.error("Faied to fetch list of stores:", error);
    throw error;
  }
};
