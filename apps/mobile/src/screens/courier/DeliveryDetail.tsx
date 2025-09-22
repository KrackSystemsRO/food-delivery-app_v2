import { ScrollView, StyleSheet } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CourierOrdersStackParamList } from "@/navigation/types";

type DeliveryDetailProps = NativeStackScreenProps<
  CourierOrdersStackParamList,
  "DeliveryDetail"
>;

export default function DeliveryDetailPage({ route }: DeliveryDetailProps) {
  const { order } = route.params;

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

      {order.status === "confirmed" && (
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => alert("Start Delivery Logic Here")}
        >
          Start Delivery
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
