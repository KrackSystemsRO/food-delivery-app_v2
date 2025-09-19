import type { IngredientType } from "./ingredient";
interface BaseRecipe {
    name: string;
    description?: string;
    ingredients?: IngredientType[];
    is_active?: boolean;
}
export interface RecipeType extends BaseRecipe {
    _id: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}
export interface RecipeForm extends BaseRecipe {
}
export {};
