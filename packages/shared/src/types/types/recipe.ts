import type { IngredientType } from "./ingredient";

export interface RecipeType {
  _id: string;
  name: string;
  description?: string;
  ingredients?: IngredientType[];
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface RecipeForm {
  name: string;
  description?: string;
  ingredients?: IngredientType[];
  is_active?: boolean;
}
