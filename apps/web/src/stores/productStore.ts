import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface ProductState {
  productsList: Types.Product.ProductType[];
  selectedProduct: Types.Product.ProductType | null;

  setProductsList: (products: Types.Product.ProductType[]) => void;
  clearProductsList: () => void;

  setSelectedProduct: (product: Types.Product.ProductType | null) => void;
  clearSelectedProduct: () => void;

  updateProductInList: (updatedProduct: Types.Product.ProductType) => void;
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
