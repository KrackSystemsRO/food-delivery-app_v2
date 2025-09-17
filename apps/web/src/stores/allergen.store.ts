import { create } from "zustand";
import type { AllergenType } from "@/types/allergen.type";

interface AllergenState {
  allergensList: AllergenType[];
  selectedAllergen: AllergenType | null;

  setAllergensList: (allergens: AllergenType[]) => void;
  clearAllergensList: () => void;

  setSelectedAllergen: (allergen: AllergenType | null) => void;
  clearSelectedAllergen: () => void;

  updateAllergenInList: (updatedAllergen: AllergenType) => void;
}

const useAllergenStore = create<AllergenState>((set) => ({
  allergensList: [],
  selectedAllergen: null,

  setAllergensList: (allergens) => set({ allergensList: allergens }),
  clearAllergensList: () => set({ allergensList: [] }),

  setSelectedAllergen: (allergen) => set({ selectedAllergen: allergen }),
  clearSelectedAllergen: () => set({ selectedAllergen: null }),

  updateAllergenInList: (updatedAllergen) =>
    set((state) => ({
      allergensList: state.allergensList.map((allergen) =>
        allergen._id === updatedAllergen._id ? updatedAllergen : allergen
      ),
    })),
}));

export default useAllergenStore;
