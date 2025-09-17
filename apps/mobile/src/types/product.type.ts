import { CategoryType } from "@/services/category.service";
import { IngredientType } from "./ingredient.type";
import { StoreType } from "./store.type";

export type ProductType = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  ingredients?: IngredientType[];
  category?: CategoryType[];
  product_type?: string;
  store: StoreType;
  available: boolean;
  is_active: boolean;
  productId: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
