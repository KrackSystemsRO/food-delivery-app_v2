import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface AllergenState {
  allergensList: Types.Allergen.AllergenType[];
  selectedAllergen: Types.Allergen.AllergenType | null;

  setAllergensList: (allergens: Types.Allergen.AllergenType[]) => void;
  clearAllergensList: () => void;

  setSelectedAllergen: (allergen: Types.Allergen.AllergenType | null) => void;
  clearSelectedAllergen: () => void;

  updateAllergenInList: (updatedAllergen: Types.Allergen.AllergenType) => void;
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
