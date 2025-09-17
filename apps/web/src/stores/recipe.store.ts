import { create } from "zustand";
import type { RecipeType } from "@/types/recipe.type";

interface RecipeState {
  recipesList: RecipeType[];
  selectedRecipe: RecipeType | null;

  setRecipesList: (recipes: RecipeType[]) => void;
  clearRecipesList: () => void;

  setSelectedRecipe: (recipe: RecipeType | null) => void;
  clearSelectedRecipe: () => void;

  updateRecipeInList: (updatedRecipe: RecipeType) => void;
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
