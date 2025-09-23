import { ScrollView, StyleSheet, Alert } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CourierOrdersStackParamList } from "@/navigation/types";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { useState } from "react";

type DeliveryDetailProps = NativeStackScreenProps<
  CourierOrdersStackParamList,
  "DeliveryDetail"
>;

export default function DeliveryDetailPage({
  route,
  navigation,
}: DeliveryDetailProps) {
  const { order } = route.params;
  const [loading, setLoading] = useState(false);

  const handleEndDelivery = async () => {
    try {
      setLoading(true);
      console.log(order);
      const payload: Types.Order.OrderForm = {
        store: order.store,
        items: order.items.filter(
          (item): item is NonNullable<typeof item> => !!item
        ),
        total: order.total,
        deliveryLocation: order.deliveryLocation,
        user: order.user,
        status: order.status,
      };

      await Services.Order.updateOrder(axiosInstance, order._id, {
        user: order.user,
        store: order.store,
        items: order.items,
        total: order.total,
        deliveryLocation: order.deliveryLocation,
        status: "delivered",
      });
      // Alert.alert("Success", "Order marked as delivered");
      // optionally navigate back or refresh
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Store: {order.store?.name ?? "-"}</Text>
          <Text variant="bodyMedium">
            Customer: {order.user?.first_name ?? "-"}{" "}
            {order.user?.last_name ?? "-"}
          </Text>
          <Text variant="bodyMedium">
            Address: {order.deliveryLocation?.address ?? "-"}
          </Text>
          <Text variant="bodyMedium">
            Phone: {order.user?.phone_number ?? "-"}
          </Text>
          <Text variant="bodyMedium">
            Price: ${order.total?.toFixed(2) ?? "0.00"}
          </Text>
          <Text variant="bodyMedium">Status: {order.status}</Text>
        </Card.Content>
      </Card>

      {order.status === ("delivering" as Types.Order.OrderStatus["status"]) && (
        <Button
          mode="contained"
          style={styles.button}
          loading={loading}
          disabled={loading}
          onPress={handleEndDelivery}
        >
          End Delivery
        </Button>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { marginBottom: 16 },
  button: { marginTop: 16 },
});
