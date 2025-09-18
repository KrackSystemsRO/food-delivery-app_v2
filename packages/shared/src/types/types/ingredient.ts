export interface AllergenType {
  _id: string;
  name: string;
  description?: string;
  is_active?: boolean;
}

export type NutritionalInfo = {
  calories?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
};

export type IngredientType = {
  _id: string;
  name: string;
  description?: string;
  allergens?: AllergenType[];
  nutritionalInfo?: NutritionalInfo;
  unit?: "piece" | "gram" | "liter";
  is_active?: boolean;
};

export interface IngredientForm {
  name: string;
  description?: string;
  allergens?: string[];
  nutritionalInfo?: Partial<NutritionalInfo>;
  unit?: string;
  is_active?: boolean;
}

export interface IngredientWithQuantity {
  ingredient: IngredientType;
  quantity?: string;
  unit: string;
}
