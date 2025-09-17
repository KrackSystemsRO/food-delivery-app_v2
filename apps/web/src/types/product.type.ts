import type { CategoryType } from "./category.type";
import type { IngredientType } from "./ingredient.type";
import type { RecipeType } from "./recipe.type";
import type { StoreType } from "./store.type";

export interface ProductVariant {
  name: string;
  price: number;
  unit?: string;
  stock_quantity?: number;
}

export interface EnergeticValues {
  calories?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
}

export interface ProductType {
  _id: string;
  productId?: number;
  store: StoreType;
  product_type: "prepared_food" | "grocery";
  name: string;
  description?: string;
  brand?: string;
  unit?: string;
  weight?: number;
  price: number;
  image?: string;
  available?: boolean;
  is_active?: boolean;
  category?: CategoryType[];
  recipe?: RecipeType;
  energetic_values?: EnergeticValues;
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ProductForm {
  store: StoreType | null;
  product_type: "prepared_food" | "grocery";
  name: string;
  description?: string;
  brand?: string;
  unit?: string;
  weight?: number;
  price: number;
  image?: string;
  available?: boolean;
  is_active?: boolean;
  ingredients?: IngredientWithQuantity[];
  category?: CategoryType[];
  recipe?: RecipeType | null;
  energetic_values?: EnergeticValues;
  variants?: ProductVariant[];
}

export interface IngredientWithQuantity {
  ingredient: IngredientType;
  quantity?: string;
  unit: string;
}
