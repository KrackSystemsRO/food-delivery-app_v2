import { Types } from "@my-monorepo/shared";
import authorizedAxios from "../../../apps/mobile/src/utils/request/authorizedRequest";

export const getListStore = async (params: Types.Store.StoreListQuery) => {
  try {
    const response = await authorizedAxios.get("/store", { params });
    return response.data;
  } catch (error) {
    console.error("Faied to fetch list of stores:", error);
    throw error;
  }
};
