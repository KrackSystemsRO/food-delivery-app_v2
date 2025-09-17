export interface NutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface IngredientType {
  _id: string;
  name: string;
  description?: string;
  allergens?: string[];
  nutritionalInfo?: NutritionalInfo;
  unit?: string;
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface IngredientForm {
  name: string;
  description?: string;
  allergens?: string[];
  nutritionalInfo?: Partial<NutritionalInfo>;
  unit?: string;
  is_active?: boolean;
}
