import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";

export default function MyDeliveriesPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Types.Order.OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      setOrders([]);
    } catch (err) {
      console.error("Error fetching deliveries", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = (orderId: string) => {
    console.log("Mark delivered:", orderId);
    // TODO: call API to update order status to 'completed'
  };

  const renderItem = ({ item }: { item: Types.Order.OrderType }) => (
    <Card style={{ margin: 8 }}>
      <Card.Content>
        <Text variant="titleMedium">{item.store.name}</Text>
        <Text variant="bodyMedium">
          {t("customer")}: {item.user.first_name} {item.user.last_name}
        </Text>
        <Text variant="bodyMedium">
          {t("address")}: {item.deliveryLocation.address}
        </Text>
        <Text variant="bodyMedium">
          {t("price")}: ${item.total.toFixed(2)}
        </Text>
        <Text variant="bodyMedium">
          {t("status")}: {item.status}
        </Text>
      </Card.Content>
      {item.status !== "delivered" && (
        <Card.Actions>
          <Button
            mode="contained"
            onPress={() => handleMarkDelivered(item._id)}
          >
            {t("mark_as_delivered")}
          </Button>
        </Card.Actions>
      )}
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={loadDeliveries}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
