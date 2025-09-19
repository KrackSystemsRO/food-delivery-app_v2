import type { IngredientType } from "./ingredient";

// --- Base Interface ---
// Shared fields between RecipeType and RecipeForm
interface BaseRecipe {
  name: string;
  description?: string;
  ingredients?: IngredientType[];
  is_active?: boolean;
}

// --- Main Interfaces ---

export interface RecipeType extends BaseRecipe {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface RecipeForm extends BaseRecipe {}
