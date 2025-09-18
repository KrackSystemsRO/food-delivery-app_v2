import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface StoreState {
  storesList: Types.Store.StoreType[];
  selectedStore: Types.Store.StoreType | null;

  setStoresList: (stores: Types.Store.StoreType[]) => void;
  clearStoresList: () => void;

  setSelectedStore: (store: Types.Store.StoreType | null) => void;
  clearSelectedStore: () => void;

  updateStoreInList: (updatedStore: Types.Store.StoreType) => void;
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
