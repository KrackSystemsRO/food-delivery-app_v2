// --- Base Interfaces ---
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

// --- Main Types ---
export interface AllergenType extends BaseAllergen {
  _id: string;
}

export interface NutritionalInfo extends BaseNutritionalInfo {}

export interface IngredientType extends BaseIngredient {
  _id: string;
  allergens?: AllergenType[];
  nutritionalInfo?: NutritionalInfo;
}

export interface IngredientForm extends BaseIngredient {
  allergens?: string[]; // just IDs for the form
  nutritionalInfo?: Partial<NutritionalInfo>; // allow partial edits
}

// Ingredient with a specific quantity and unit
export interface IngredientWithQuantity {
  ingredient: IngredientType;
  quantity?: string; // kept as string for easier form binding
  unit: string;
}
