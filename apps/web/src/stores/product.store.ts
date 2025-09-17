import { create } from "zustand";
import type { ProductType } from "@/types/product.type";

interface ProductState {
  productsList: ProductType[];
  selectedProduct: ProductType | null;

  setProductsList: (products: ProductType[]) => void;
  clearProductsList: () => void;

  setSelectedProduct: (product: ProductType | null) => void;
  clearSelectedProduct: () => void;

  updateProductInList: (updatedProduct: ProductType) => void;
}

const useProductStore = create<ProductState>((set) => ({
  productsList: [],
  selectedProduct: null,

  setProductsList: (products) => set({ productsList: products }),
  clearProductsList: () => set({ productsList: [] }),

  setSelectedProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  updateProductInList: (updatedProduct) =>
    set((state) => ({
      productsList: state.productsList.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      ),
    })),
}));

export default useProductStore;
