import { create } from "zustand";
import type { CategoryType } from "@/types/category.type";

interface CategoryState {
  categoriesList: CategoryType[];
  selectedCategory: CategoryType | null;

  setCategoriesList: (categories: CategoryType[]) => void;
  clearCategoriesList: () => void;

  setSelectedCategory: (category: CategoryType | null) => void;
  clearSelectedCategory: () => void;

  updateCategoryInList: (updatedCategory: CategoryType) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
  categoriesList: [],
  selectedCategory: null,

  setCategoriesList: (categories) => set({ categoriesList: categories }),
  clearCategoriesList: () => set({ categoriesList: [] }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  clearSelectedCategory: () => set({ selectedCategory: null }),

  updateCategoryInList: (updatedCategory) =>
    set((state) => ({
      categoriesList: state.categoriesList.map((category) =>
        category._id === updatedCategory._id ? updatedCategory : category
      ),
    })),
}));

export default useCategoryStore;
