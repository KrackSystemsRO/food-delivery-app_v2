import { create } from "zustand";
import type { OrderType } from "@/types/order.type";

interface OrderState {
  ordersList: OrderType[];
  selectedOrder: OrderType | null;

  setOrdersList: (orders: OrderType[]) => void;
  clearOrdersList: () => void;

  setSelectedOrder: (order: OrderType | null) => void;
  clearSelectedOrder: () => void;

  updateOrderInList: (updatedOrder: OrderType) => void;
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
