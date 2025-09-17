export interface OrderType {
  _id: string;
  orderId?: number;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  store: {
    _id: string;
    name: string;
    is_open: boolean;
  };
  items: {
    _id: string;
    product: {
      _id: string;
      name: string;
      image: string;
      available: boolean;
    };
    quantity: number;
    observations: string;
  }[];
  total: number;
  status: "pending" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface OrderForm {
  user: string;
  store: string;
  items: {
    product: string;
    quantity: number;
    observations?: string;
  }[];
  total: number;
  status?: "pending" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}
