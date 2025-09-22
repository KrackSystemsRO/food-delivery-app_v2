import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import MultiSelectWithChips from "@/components/select/MultiSelectWithChips";

import { useAuth } from "@/context/authContext";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { OrdersStackParamList } from "@/navigation/types";

const OrderCard: React.FC<{
  order: Types.Order.OrderType;
  onAccept: (id: string) => void;
  onDeny: (id: string) => void;
  onPress: () => void;
}> = React.memo(({ order, onAccept, onDeny, onPress }) => (
  <Card onPress={onPress} style={{ marginBottom: 12 }}>
    <Card.Title
      title={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>{order.store.name}</Text>
          <Text style={{ marginLeft: 4 }}> - Order #{order.orderId}</Text>
        </View>
      }
      subtitle={
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>
            {order.user.first_name} {order.user.last_name} {"\u2022"}
          </Text>
          <Text
            style={{
              backgroundColor:
                order.status === "pending"
                  ? "orange"
                  : order.status === "confirmed"
                  ? "green"
                  : "red",
              paddingVertical: 6,
              paddingHorizontal: 8,
              borderRadius: 50,
              color: "white",
              marginTop: -6,
            }}
          >
            {order.status}
          </Text>
        </View>
      }
    />
    <Card.Content>
      <Text>Total: ${order.total.toFixed(2)}</Text>
    </Card.Content>
    {order.status === "pending" && (
      <Card.Actions>
        <Button onPress={() => onAccept(order._id)}>Accept</Button>
        <Button onPress={() => onDeny(order._id)}>Deny</Button>
      </Card.Actions>
    )}
  </Card>
));

type OrdersListNavProp = NativeStackNavigationProp<
  OrdersStackParamList,
  "OrderDetail"
>;

const ManagerOrdersScreen: React.FC = () => {
  const { socket, user, updateSelectedStores } = useAuth();
  const [stores, setStores] = useState<Types.Store.StoreType[]>([]);
  const [selectedStores, setSelectedStores] = useState<Types.Store.StoreType[]>(
    []
  );
  const [orders, setOrders] = useState<Types.Order.OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<OrdersListNavProp>();

  const selectedStoresRef = useRef<Types.Store.StoreType[]>([]);
  selectedStoresRef.current = selectedStores;

  const socketRef = useRef<any>(null);

  /** Load stores */
  useEffect(() => {
    (async () => {
      try {
        const storeData = await Services.Store.getStores(axiosInstance, {
          is_active: true,
        });
        setStores(storeData.result ?? []);
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    })();
  }, []);

  /** Load orders for selected stores */
  const fetchOrders = useCallback(async () => {
    if (!selectedStores.length) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const storeIds = selectedStores.map((s) => s._id);
      const response = await Services.Order.getUserOrdersByStores(
        axiosInstance,
        storeIds
      );
      setOrders(response.result ?? []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStores]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /** Initialize socket */
  useEffect(() => {
    // Only run if a manager is logged in and the socket exists
    if (!socket || user?.role !== "MANAGER") return;

    const handleNewOrder = (order: Types.Order.OrderType) => {
      // optional: filter by selected stores if needed
      setOrders((prev) => [order, ...prev.filter((o) => o._id !== order._id)]);
    };

    const handleOrderUpdate = (order: Types.Order.OrderType) => {
      setOrders((prev) => {
        const idx = prev.findIndex((o) => o._id === order._id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = order;
          return updated;
        }
        return [order, ...prev];
      });
    };

    socket.on("newOrder", handleNewOrder);
    socket.on("orderUpdated", handleOrderUpdate);
    // socket.on("order:update", handleOrderUpdate);

    return () => {
      socket.off("newOrder", handleNewOrder);
      socket.off("orderUpdated", handleOrderUpdate);
      // socket.off("order:update", handleOrderUpdate);
    };
  }, [socket, user]);

  /** Join rooms when selectedStores change */
  useEffect(() => {
    if (!user || user.role !== "MANAGER") return;

    // Map selected stores to the format expected by AuthProvider
    const storesToJoin = selectedStores.map((store) => ({
      storeId: store._id,
      cityId: store.cityId,
      zoneId: store.zoneId,
    }));

    updateSelectedStores(storesToJoin);
  }, [selectedStores, user, updateSelectedStores]);

  /** Refresh list */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  }, [fetchOrders]);

  /** Accept / Deny */
  const handleAcceptOrder = useCallback(async (orderId: string) => {
    await Services.Order.acceptOrder(axiosInstance, orderId);
  }, []);
  const handleDenyOrder = useCallback(async (orderId: string) => {
    await Services.Order.denyOrder(axiosInstance, orderId);
  }, []);

  /** Render order card */
  const renderItem = useCallback(
    ({ item }: { item: Types.Order.OrderType }) => (
      <OrderCard
        order={item}
        onAccept={handleAcceptOrder}
        onDeny={handleDenyOrder}
        onPress={() => navigation.navigate("OrderDetail", { _id: item._id })}
      />
    ),
    [handleAcceptOrder, handleDenyOrder]
  );

  /** List header with store selector */
  const listHeader = useMemo(
    () => (
      <View style={{ marginBottom: 16 }}>
        <MultiSelectWithChips<Types.Store.StoreType>
          label="Select Stores"
          options={stores}
          selected={selectedStores}
          onChange={setSelectedStores}
          mapper={{ getId: (s) => s._id, getLabel: (s) => s.name }}
          allowCreate={false}
        />
      </View>
    ),
    [stores, selectedStores]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading orders...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item, index) => item._id ?? `${item.orderId}_${index}`}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      contentContainerStyle={{ padding: 16 }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

export default ManagerOrdersScreen;
