import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";
import { Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import DatePicker from "@/components/DatePicker";
import { RefreshControl } from "react-native-gesture-handler";

export default function MyDeliveriesPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Types.Order.OrderType[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadDeliveries();
  }, [selectedDate]);

  const loadDeliveries = async () => {
    setLoading(true);
    try {
      const res = await Services.Order.getOrders(axiosInstance, {
        date: selectedDate,
      });

      setOrders(res.result);
    } catch (err) {
      console.error("Error fetching deliveries", err);
    } finally {
      setLoading(false);
    }
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
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
          {selectedDate.toDateString()}
        </Button>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadDeliveries}
              tintColor="#6200ee"
              colors={["#6200ee"]}
            />
          }
          contentContainerStyle={{ padding: 8 }}
        />
      </View>

      <DatePicker
        date={selectedDate}
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        onSelectDate={(date) => setSelectedDate(date)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
