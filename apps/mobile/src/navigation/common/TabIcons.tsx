import {
  ClientTabsParamList,
  CourierTabsParamList,
  ManagerTabsParamList,
} from "@/navigation/types";

// Client icons
export function getClientTabIcon(name: keyof ClientTabsParamList) {
  switch (name) {
    case "StoresTab":
      return "store";
    case "CartTab":
      return "shopping-cart";
    case "OrdersTab":
      return "receipt-long";
    case "ProfileTab":
      return "person";
  }
}

// Courier icons
export function getCourierTabIcon(name: keyof CourierTabsParamList) {
  switch (name) {
    case "OrdersTab":
      return "assignment";
    case "DeliveriesTab":
      return "local-shipping";
    case "ProfileTab":
      return "person";
  }
}

// Manager icons
export function getManagerTabIcon(name: keyof ManagerTabsParamList) {
  switch (name) {
    case "Orders":
      return "list";
    case "Products":
      return "cube";
    case "Profile":
      return "person";
  }
}
