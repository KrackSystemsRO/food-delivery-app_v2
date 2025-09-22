import { CategoryType } from "./category";
import { IngredientType, IngredientWithQuantity } from "./ingredient";
import { RecipeType } from "./recipe";
import { StoreType } from "./store";
export type ProductType = {
    _id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    ingredients?: IngredientType[];
    category?: CategoryType[];
    product_type?: "prepared_food" | "grocery";
    recipe?: RecipeType;
    energetic_values?: EnergeticValues;
    store: StoreType;
    variants?: ProductVariant[];
    weight?: number;
    available: boolean;
    is_active: boolean;
    productId: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
};
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
