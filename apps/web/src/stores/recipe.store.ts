import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface RecipeState {
  recipesList: Types.Recipe.RecipeType[];
  selectedRecipe: Types.Recipe.RecipeType | null;

  setRecipesList: (recipes: Types.Recipe.RecipeType[]) => void;
  clearRecipesList: () => void;

  setSelectedRecipe: (recipe: Types.Recipe.RecipeType | null) => void;
  clearSelectedRecipe: () => void;

  updateRecipeInList: (updatedRecipe: Types.Recipe.RecipeType) => void;
}

const useRecipeStore = create<RecipeState>((set) => ({
  recipesList: [],
  selectedRecipe: null,

  setRecipesList: (recipes) => set({ recipesList: recipes }),
  clearRecipesList: () => set({ recipesList: [] }),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
  clearSelectedRecipe: () => set({ selectedRecipe: null }),

  updateRecipeInList: (updatedRecipe) =>
    set((state) => ({
      recipesList: state.recipesList.map((recipe) =>
        recipe._id === updatedRecipe._id ? updatedRecipe : recipe
      ),
    })),
}));

export default useRecipeStore;
