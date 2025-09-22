import type { CategoryType } from "./category";
import type { IngredientType, IngredientWithQuantity } from "./ingredient";
import type { RecipeType } from "./recipe";
import type { StoreType } from "./store";
interface BaseProduct {
    name: string;
    description?: string;
    price: number;
    image?: string;
    weight?: number;
    category?: CategoryType[];
    recipe?: RecipeType | null;
    energetic_values?: EnergeticValues;
    variants?: ProductVariant[];
    product_type: "prepared_food" | "grocery";
}
export interface ProductType extends Readonly<BaseProduct> {
    readonly _id: string;
    readonly ingredients?: ReadonlyArray<IngredientType>;
    readonly store: StoreType;
    readonly available: boolean;
    readonly is_active: boolean;
    readonly productId: number;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly __v: number;
}
export interface ProductForm extends BaseProduct {
    store: StoreType | null;
    brand?: string;
    unit?: string;
    available?: boolean;
    is_active?: boolean;
    ingredients?: IngredientWithQuantity[];
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
export {};
