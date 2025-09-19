import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface CategoryState {
  categoriesList: Types.Category.CategoryType[];
  selectedCategory: Types.Category.CategoryType | null;

  setCategoriesList: (categories: Types.Category.CategoryType[]) => void;
  clearCategoriesList: () => void;

  setSelectedCategory: (category: Types.Category.CategoryType | null) => void;
  clearSelectedCategory: () => void;

  updateCategoryInList: (updatedCategory: Types.Category.CategoryType) => void;
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
