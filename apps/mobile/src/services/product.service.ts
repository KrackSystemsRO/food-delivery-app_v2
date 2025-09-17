import { StoreType } from "@/types/store.type";
import authorizedAxios from "../utils/request/authorizedRequest";
import { ProductType } from "@/types/product.type";

export interface CreateProductPayload {
  name: string;
  description?: string;
  store: StoreType | null;
  price: number;
  is_active: boolean;
  product_type: "prepared_food" | "product";
  categories: string[];
  ingredients: {
    ingredient: string;
    quantity: number;
    unit: string;
  }[];
}

export const getListProductsStore = async (idStore: string) => {
  try {
    const response = await authorizedAxios.get(`/product?store=${idStore}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products of store ", error);
    throw error;
  }
};

export const getUserProductsStore = async (storeId: string | string[]) => {
  try {
    // Handle empty array or undefined by not adding store query
    let url = "/product";
    if (Array.isArray(storeId) && storeId.length > 0) {
      url += `?store=${storeId.join(",")}`; // join multiple IDs
    } else if (typeof storeId === "string" && storeId) {
      url += `?store=${storeId}`;
    }

    const response = await authorizedAxios.get(url);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products of store ", error);
    throw error;
  }
};

export const getUserProductsStores = async (stores: StoreType[]) => {
  try {
    const allProducts = await Promise.all(
      stores.map(async (storeId) => {
        const response = await authorizedAxios.get(
          `/product?store=${storeId._id}`
        );
        return response.data.result ?? [];
      })
    );

    // Flatten the array of arrays into a single array
    return allProducts.flat();
  } catch (error) {
    console.error("Failed to fetch products of store ", error);
    throw error;
  }
};

export const saveNewProduct = async (data: CreateProductPayload) => {
  try {
    const response = await authorizedAxios.post(`/product`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to add product of store ", error);
    throw error;
  }
};

export const updateProduct = async (id: string, data: Partial<ProductType>) => {
  try {
    const response = await authorizedAxios.put(`/product/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update product of store ", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await authorizedAxios.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete product of store ", error);
    throw error;
  }
};
