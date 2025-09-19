export interface BaseAllergen {
    name: string;
    description?: string;
    is_active?: boolean;
}
export interface BaseNutritionalInfo {
    calories?: number;
    protein?: number;
    fat?: number;
    fiber?: number;
    sugar?: number;
}
export interface BaseIngredient {
    name: string;
    description?: string;
    unit?: "piece" | "gram" | "liter";
    is_active?: boolean;
}
export interface AllergenType extends BaseAllergen {
    _id: string;
}
export interface NutritionalInfo extends BaseNutritionalInfo {
}
export interface IngredientType extends BaseIngredient {
    _id: string;
    allergens?: AllergenType[];
    nutritionalInfo?: NutritionalInfo;
}
export interface IngredientForm extends BaseIngredient {
    allergens?: string[];
    nutritionalInfo?: Partial<NutritionalInfo>;
}
export interface IngredientWithQuantity {
    ingredient: IngredientType;
    quantity?: string;
    unit: string;
}
