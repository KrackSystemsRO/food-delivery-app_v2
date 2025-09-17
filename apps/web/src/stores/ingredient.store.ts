import { create } from "zustand";
import type { IngredientType } from "@/types/ingredient.type";

interface IngredientState {
  ingredientsList: IngredientType[];
  selectedIngredient: IngredientType | null;

  setIngredientsList: (ingredients: IngredientType[]) => void;
  clearIngredientsList: () => void;

  setSelectedIngredient: (ingredient: IngredientType | null) => void;
  clearSelectedIngredient: () => void;

  updateIngredientInList: (updatedIngredient: IngredientType) => void;
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
