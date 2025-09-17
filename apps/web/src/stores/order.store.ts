import type { Types } from "@my-monorepo/shared";
import { create } from "zustand";

interface OrderState {
  ordersList: Types.Order.OrderType[];
  selectedOrder: Types.Order.OrderType | null;

  setOrdersList: (orders: Types.Order.OrderType[]) => void;
  clearOrdersList: () => void;

  setSelectedOrder: (order: Types.Order.OrderType | null) => void;
  clearSelectedOrder: () => void;

  updateOrderInList: (updatedOrder: Types.Order.OrderType) => void;
}

const useOrderStore = create<OrderState>((set) => ({
  ordersList: [],
  selectedOrder: null,

  setOrdersList: (orders) => set({ ordersList: orders }),
  clearOrdersList: () => set({ ordersList: [] }),

  setSelectedOrder: (order) => set({ selectedOrder: order }),
  clearSelectedOrder: () => set({ selectedOrder: null }),

  updateOrderInList: (updatedOrder) =>
    set((state) => ({
      ordersList: state.ordersList.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      ),
    })),
}));

export default useOrderStore;
