import { create } from "zustand";
import type { StoreType } from "@/types/store.type";

interface StoreState {
  storesList: StoreType[];
  selectedStore: StoreType | null;

  setStoresList: (stores: StoreType[]) => void;
  clearStoresList: () => void;

  setSelectedStore: (store: StoreType | null) => void;
  clearSelectedStore: () => void;

  updateStoreInList: (updatedStore: StoreType) => void;
}

const useStore = create<StoreState>((set) => ({
  storesList: [],
  selectedStore: null,

  setStoresList: (stores) => set({ storesList: stores }),
  clearStoresList: () => set({ storesList: [] }),

  setSelectedStore: (store) => set({ selectedStore: store }),
  clearSelectedStore: () => set({ selectedStore: null }),

  updateStoreInList: (updatedStore) =>
    set((state) => ({
      storesList: state.storesList.map((store) =>
        store._id === updatedStore._id ? updatedStore : store
      ),
    })),
}));

export default useStore;
