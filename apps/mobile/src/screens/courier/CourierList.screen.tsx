import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Card, Text, Button, ActivityIndicator } from "react-native-paper";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTranslation } from "react-i18next";
import { acceptOrder } from "@/services/order.service";
import { getOrders } from "@/services/courier.service";
import { OrderType } from "@/types/order.type";
import { useAuth } from "@/context/authContext";

/* ------------------ Order Card ------------------ */
const OrderCard = React.memo(({ order, onAccept, t, navigation }: any) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("DeliveryDetail", { order })}
  >
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">
          {order.store?.name ?? t("unknown_store")}
        </Text>
        <Text variant="bodyMedium">
          {t("customer")}: {order.user?.first_name ?? "-"}{" "}
          {order.user?.last_name ?? "-"}
        </Text>
        <Text variant="bodyMedium">
          {t("address")}: {order.deliveryLocation?.address ?? "-"}
        </Text>
        <Text variant="bodyMedium">
          {t("price")}: ${order.total?.toFixed(2) ?? "0.00"}
        </Text>
      </Card.Content>
      {order.status === "confirmed" && (
        <Card.Actions>
          <Button mode="contained" onPress={() => onAccept(order._id)}>
            {t("accept_order")}
          </Button>
        </Card.Actions>
      )}
    </Card>
  </TouchableOpacity>
));

/* ------------------ Orders List ------------------ */
const OrdersList = React.memo(
  ({
    orders,
    onAccept,
    t,
    loading,
    onRefresh,
    refreshing,
    navigation,
  }: any) => {
    const renderItem = useCallback(
      ({ item }: { item: OrderType }) => (
        <OrderCard
          order={item}
          onAccept={onAccept}
          t={t}
          navigation={navigation}
        />
      ),
      [onAccept, t, navigation]
    );

    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>{t("loading_orders")}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    );
  }
);

/* ------------------ Tab Navigator ------------------ */
const Tab = createMaterialTopTabNavigator();

export default function CourierOrdersPage({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const { socket, user } = useAuth();

  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ------------------ Load Orders ------------------ */
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrders({ limit: 100 });
      setOrders(response.result);
    } catch (err) {
      console.error("Error fetching orders", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  /* ------------------ Accept Order ------------------ */
  const handleAcceptOrder = useCallback(async (orderId: string) => {
    try {
      await acceptOrder(orderId);
    } catch (err) {
      console.error("Failed to accept order:", err);
    }
  }, []);

  /* ------------------ Socket Updates ------------------ */
  useEffect(() => {
    // Only run when both socket and user are ready
    if (!socket || !user) return;
    if (user.role !== "COURIER") return;

    const handleOrderCreated = (payload: any) => {
      const order = payload.data ?? payload;
      if (!order) return;
      setOrders((prev) => [order, ...prev]);
    };

    const handleOrderUpdated = (payload: any) => {
      const order = payload.data ?? payload;
      if (!order) return;
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

    // Register listeners
    socket.on("orderCreated", handleOrderCreated);
    socket.on("orderUpdated", handleOrderUpdated);

    // Cleanup
    return () => {
      socket.off("orderCreated", handleOrderCreated);
      socket.off("orderUpdated", handleOrderUpdated);
    };
  }, [socket, user]);

  /* ------------------ Filter Orders ------------------ */
  const { activeOrders, futureOrders } = useMemo(() => {
    const active: OrderType[] = [];
    const future: OrderType[] = [];
    orders.forEach((o) => {
      if (o.status === "confirmed" || o.status === "delivering") active.push(o);
      else if (o.status === "pending") future.push(o);
    });
    return { activeOrders: active, futureOrders: future };
  }, [orders]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator screenOptions={{ swipeEnabled: true }}>
        <Tab.Screen
          name="ActiveOrders"
          options={{ title: t("courier.active_orders") }}
        >
          {() => (
            <OrdersList
              orders={activeOrders}
              onAccept={handleAcceptOrder}
              t={t}
              loading={loading}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              navigation={navigation}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="FutureOrders"
          options={{ title: t("courier.future_orders") }}
        >
          {() => (
            <OrdersList
              orders={futureOrders}
              onAccept={handleAcceptOrder}
              t={t}
              loading={loading}
              onRefresh={handleRefresh}
              refreshing={refreshing}
              navigation={navigation}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { margin: 8 },
  listContainer: { padding: 8 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
