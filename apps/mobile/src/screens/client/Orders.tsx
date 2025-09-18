import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Services, Types } from "@my-monorepo/shared";
import { useAuth } from "@/context/authContext";
import axiosInstance from "@/utils/request/authorizedRequest";

type OrdersRoute = { key: string; title: string };

export default function OrdersScreen() {
  const { user, socket } = useAuth();
  const [orders, setOrders] = useState<Types.Order.OrderType[]>([]);
  const [index, setIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [routes] = useState<OrdersRoute[]>([
    { key: "active", title: "Active Orders" },
    { key: "completed", title: "Completed Orders" },
  ]);

  /** Fetch orders from backend */
  const fetchOrders = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await Services.Order.getOrders(axiosInstance, {});
      setOrders(response.result);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /** Handle socket updates */
  useEffect(() => {
    // Only run if we have a socket and this user is a CLIENT
    if (!socket || user?.role !== "CLIENT") return;

    const handleOrderUpdate = (order: Types.Order.OrderType) => {
      setOrders((prev) => {
        const idx = prev.findIndex((o) => o._id === order._id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = order;
          return copy;
        }
        return [order, ...prev];
      });
    };

    // Listen for updates
    socket.on("order:update", handleOrderUpdate);
    socket.on("orderCreated", handleOrderUpdate);

    // Clean up on unmount
    return () => {
      socket.off("order:update", handleOrderUpdate);
      socket.off("orderCreated", handleOrderUpdate);
    };
  }, [socket, user]);

  /** Filter orders by status */
  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  );
  const completedOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "cancelled"
  );

  const renderOrder = ({ item }: { item: Types.Order.OrderType }) => (
    <View style={styles.orderCard}>
      <Text style={styles.storeName}>{item.store.name}</Text>
      <Text>Order ID: {item.orderId}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: ${item.total.toFixed(2)}</Text>
      <Text>Delivery: {item.deliveryLocation.address}</Text>
    </View>
  );

  const renderScene = ({ route }: { route: OrdersRoute }) => {
    const data = route.key === "active" ? activeOrders : completedOrders;
    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 8 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            {route.key === "active"
              ? "No active orders."
              : "No completed orders."}
          </Text>
        }
        refreshing={refreshing}
        onRefresh={fetchOrders}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Orders</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get("window").width }}
        renderTabBar={(props: any) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "black" }}
            style={{ backgroundColor: "#fff" }}
            activeColor="black"
            inactiveColor="black"
            renderLabel={({ route }: { route: OrdersRoute }) => (
              <Text style={{ fontWeight: "bold" }}>{route.title}</Text>
            )}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 16 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  orderCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  storeName: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
});
