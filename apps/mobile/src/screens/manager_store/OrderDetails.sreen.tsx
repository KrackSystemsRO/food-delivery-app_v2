import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, ActivityIndicator, Alert, FlatList } from "react-native";
import { Button, Text, Card, Divider } from "react-native-paper";
import { getOrderById, acceptOrder, denyOrder } from "@/services/order.service";
import { Types } from "@my-monorepo/shared";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { OrdersStackParamList } from "@/components/layouts/ManagerLayout";
import { getSocket } from "@/services/soket.connection/socket";

export type OrderDetailProps = NativeStackScreenProps<
  OrdersStackParamList,
  "OrderDetail"
>;

// Memoized Order Item
const OrderItemCard: React.FC<{ item: Types.Order.OrderItemType }> = React.memo(
  ({ item }) => (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title title={`${item.quantity} x ${item.product.name}`} />
      {item.observations && (
        <Card.Content>
          <Text style={{ color: "red" }}>
            <Text style={{ fontWeight: "bold" }}>Observations</Text>:{" "}
            {item.observations}
          </Text>
        </Card.Content>
      )}
    </Card>
  )
);

// Memoized Header
const OrderListHeader = React.memo<{
  order: Types.Order.OrderType | null;
  statusColor: string;
}>(({ order, statusColor }) => {
  if (!order) return null; // render nothing if order is null

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title={`Order #${order.orderId}`} />
        <Card.Content>
          <Text>
            Status:{" "}
            <Text style={{ color: statusColor, fontWeight: "bold" }}>
              {order.status.toUpperCase()}
            </Text>
          </Text>
          <Text>
            Customer: {order.user.first_name} {order.user.last_name}
          </Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
        </Card.Content>
      </Card>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Items
      </Text>
    </>
  );
});

// Memoized Footer
const OrderListFooter = React.memo<{
  order: Types.Order.OrderType | null;
  onAccept: () => void;
  onDeny: () => void;
}>(({ order, onAccept, onDeny }) => {
  if (!order || order.status !== "pending") return null;

  return (
    <View style={{ marginVertical: 16, flexDirection: "row", gap: 12 }}>
      <Button mode="contained" onPress={onAccept} style={{ flex: 1 }}>
        Accept
      </Button>
      <Button mode="outlined" onPress={onDeny} style={{ flex: 1 }}>
        Deny
      </Button>
    </View>
  );
});

const OrderDetailScreen: React.FC<OrderDetailProps> = ({ route }) => {
  const { _id } = route.params;
  const [order, setOrder] = useState<Types.Order.OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetail = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getOrderById(_id);
      setOrder(response.result);
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

  useEffect(() => {
    const socket = getSocket();

    socket.on("order:update", (updatedOrder) => {
      if (updatedOrder._id === _id) {
        setOrder(updatedOrder);
      }
    });

    return () => {
      socket.off("order:update");
    };
  }, [_id]);

  const handleAccept = useCallback(async () => {
    try {
      await acceptOrder(_id);
      Alert.alert("Success", "Order accepted");
    } catch {
      Alert.alert("Error", "Failed to accept order");
    }
  }, [_id]);

  const handleDeny = useCallback(async () => {
    try {
      await denyOrder(_id);
      Alert.alert("Success", "Order denied");
      fetchOrderDetail();
    } catch {
      Alert.alert("Error", "Failed to deny order");
    }
  }, [_id, fetchOrderDetail]);

  const statusColor = useMemo(() => {
    switch (order?.status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "green";
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

  const headerComponent = useMemo(
    () => <OrderListHeader order={order} statusColor={statusColor} />,
    [order, statusColor]
  );

  const footerComponent = useMemo(
    () => (
      <OrderListFooter
        order={order}
        onAccept={handleAccept}
        onDeny={handleDeny}
      />
    ),
    [order, handleAccept, handleDeny]
  );

  if (loading || !order) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading order...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={order.items}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
      contentContainerStyle={{ padding: 16 }}
      refreshing={loading}
      onRefresh={fetchOrderDetail}
    />
  );
};

export default React.memo(OrderDetailScreen);
