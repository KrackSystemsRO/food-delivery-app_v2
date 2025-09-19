import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface IngredientState {
  ingredientsList: Types.Ingredient.IngredientType[];
  selectedIngredient: Types.Ingredient.IngredientType | null;

  setIngredientsList: (ingredients: Types.Ingredient.IngredientType[]) => void;
  clearIngredientsList: () => void;

  setSelectedIngredient: (
    ingredient: Types.Ingredient.IngredientType | null
  ) => void;
  clearSelectedIngredient: () => void;

  updateIngredientInList: (
    updatedIngredient: Types.Ingredient.IngredientType
  ) => void;
}

const useIngredientStore = create<IngredientState>((set) => ({
  ingredientsList: [],
  selectedIngredient: null,

  setIngredientsList: (ingredients) => set({ ingredientsList: ingredients }),
  clearIngredientsList: () => set({ ingredientsList: [] }),

  setSelectedIngredient: (ingredient) =>
    set({ selectedIngredient: ingredient }),
  clearSelectedIngredient: () => set({ selectedIngredient: null }),

  updateIngredientInList: (updatedIngredient) =>
    set((state) => ({
      ingredientsList: state.ingredientsList.map((ingredient) =>
        ingredient._id === updatedIngredient._id
          ? updatedIngredient
          : ingredient
      ),
    })),
}));

export default useIngredientStore;
