import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
} from "react-native";
import { Button, Text, Card } from "react-native-paper";
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import { ClientTabsParamList, OrdersStackParamList } from "@/navigation/types";
import { getSocket } from "@/services/soket.connection/socket";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { useCart } from "@/context/CartContext";
import { useNavigation } from "@react-navigation/native";

/* ---------- Types ---------- */
export type ClientOrderDetailProps = NativeStackScreenProps<
  OrdersStackParamList,
  "OrderDetail"
>;

/* ---------- Item Card ---------- */
const OrderItemCard = React.memo<{ item: Types.Order.OrderItemType }>(
  ({ item }) => (
    <Card style={styles.itemCard}>
      <Card.Title title={`${item.quantity} × ${item.product.name}`} />
      {item.observations && (
        <Card.Content>
          <Text style={styles.observations}>
            <Text style={styles.observationsLabel}>Observations: </Text>
            {item.observations}
          </Text>
        </Card.Content>
      )}
    </Card>
  )
);

/* ---------- Header ---------- */
const OrderListHeader = React.memo<{
  order: Types.Order.OrderType | null;
  statusColor: string;
}>(({ order, statusColor }) => {
  if (!order) return null;
  return (
    <>
      <Card style={styles.headerCard}>
        <Card.Title title={`Order #${order.orderId}`} />
        <Card.Content>
          <Text>
            Status:{" "}
            <Text style={{ color: statusColor, fontWeight: "bold" }}>
              {order.status.toUpperCase()}
            </Text>
          </Text>
          <Text>Store: {order.store.name}</Text>
          <Text>Delivery Address: {order.deliveryLocation.address}</Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
        </Card.Content>
      </Card>
      <Text variant="titleMedium" style={styles.itemsTitle}>
        Items
      </Text>
    </>
  );
});

/* ---------- Footer (Repeat Order for completed/cancelled) ---------- */
const OrderListFooter = React.memo<{
  order: Types.Order.OrderType | null;
  onRepeat: () => void;
}>(({ order, onRepeat }) => {
  if (!order) return null;

  const isCompleted =
    order.status === "delivered" || order.status === "cancelled";

  if (!isCompleted) return null;

  return (
    <View style={styles.footer}>
      <Button mode="contained" onPress={onRepeat} style={styles.flex1}>
        Repeat Order
      </Button>
    </View>
  );
});

/* ---------- Screen ---------- */
const ClientOrderDetailScreen: React.FC<ClientOrderDetailProps> = ({
  route,
}) => {
  const { _id } = route.params;
  const [order, setOrder] = useState<Types.Order.OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const { syncAddToCart, dispatch } = useCart();
  const navigation =
    useNavigation<NativeStackNavigationProp<ClientTabsParamList>>();

  /** Fetch detail */
  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    try {
      const { result } = await Services.Order.getOrderById(axiosInstance, _id);
      setOrder(result);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load order details");
    } finally {
      setLoading(false);
    }
  }, [_id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  /** Live updates via socket */
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleUpdate = (updated: Types.Order.OrderType) => {
      if (updated._id === _id) setOrder(updated);
    };
    socket.on("order:update", handleUpdate);
    return () => {
      socket.off("order:update", handleUpdate);
    };
  }, [_id]);

  /** Repeat order action */
  const handleRepeatOrder = useCallback(async () => {
    if (!order) return;
    try {
      // clear any existing cart content first
      dispatch({ type: "CLEAR_CART" });

      // add each item from this order back into the cart
      await Promise.all(
        order.items.map((i) =>
          syncAddToCart(
            {
              product: i.product._id,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
              observations: i.observations,
            },
            order.store._id
          )
        )
      );

      // navigate to the Cart screen
      navigation.navigate("CartTab");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to repeat order");
    }
  }, [order, syncAddToCart, dispatch, navigation]);

  /** Status color */
  const statusColor = useMemo(() => {
    switch (order?.status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green";
      case "delivered":
        return "blue";
      case "cancelled":
        return "red";
      default:
        return "gray";
    }
  }, [order?.status]);

  const renderItem = useCallback(
    ({ item }: { item: Types.Order.OrderItemType }) => (
      <OrderItemCard item={item} />
    ),
    []
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading order...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>No order found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={order.items}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListHeaderComponent={
        <OrderListHeader order={order} statusColor={statusColor} />
      }
      ListFooterComponent={
        <OrderListFooter order={order} onRepeat={handleRepeatOrder} />
      }
      contentContainerStyle={styles.listContent}
      refreshing={loading}
      onRefresh={fetchOrderDetail}
    />
  );
};

export default React.memo(ClientOrderDetailScreen);

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: 16 },
  itemCard: { marginBottom: 12 },
  headerCard: { marginBottom: 16 },
  itemsTitle: { marginBottom: 8 },
  footer: { marginVertical: 16, flexDirection: "row", gap: 12 },
  flex1: { flex: 1 },
  observations: { color: "red" },
  observationsLabel: { fontWeight: "bold" },
});
