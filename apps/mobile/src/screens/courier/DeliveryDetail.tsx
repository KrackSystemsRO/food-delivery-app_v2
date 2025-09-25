import {
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
  View,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CourierOrdersStackParamList } from "@/navigation/types";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { useState } from "react";
import SwipeButton from "rn-swipe-button"; // ✅ slide button

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
      await Services.Order.updateOrder(axiosInstance, order._id, {
        user: order.user,
        store: order.store,
        items: order.items,
        total: order.total,
        deliveryLocation: order.deliveryLocation,
        status: "delivered",
      });
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = async () => {
    const { lat, lng, address } = order.deliveryLocation || {};
    if (lat == null || lng == null) {
      if (address) {
        const encoded = encodeURIComponent(address);
        const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
        const appleUrl = `http://maps.apple.com/?daddr=${encoded}`;
        await Linking.openURL(Platform.OS === "ios" ? appleUrl : googleUrl);
      } else {
        Alert.alert("No location", "This order has no location data.");
      }
      return;
    }

    const coords = `${lat},${lng}`;
    const wazeUrl = `https://waze.com/ul?ll=${coords}&navigate=yes`;
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${coords}`;
    const appleUrl = `http://maps.apple.com/?daddr=${coords}`;

    try {
      const canOpenWaze = await Linking.canOpenURL(wazeUrl);
      if (canOpenWaze) {
        await Linking.openURL(wazeUrl);
      } else if (Platform.OS === "ios") {
        await Linking.openURL(appleUrl);
      } else {
        await Linking.openURL(googleUrl);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not open map application.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

        <Button
          mode="outlined"
          style={styles.button}
          icon="map"
          onPress={handleOpenMap}
        >
          Open in Maps / Waze
        </Button>
      </ScrollView>

      {order.status === "delivering" && (
        <View style={styles.swipeContainer}>
          <SwipeButton
            disabled={loading}
            swipeSuccessThreshold={70}
            height={55}
            title={loading ? "Updating..." : "Slide to End Delivery"}
            onSwipeSuccess={handleEndDelivery}
            railBackgroundColor="#e0e0e0"
            railFillBackgroundColor="#4caf50"
            thumbIconBackgroundColor="#fff"
            thumbIconBorderColor="#4caf50"
            titleColor="#000"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 100 }, // leave space for swipe button
  card: { marginBottom: 16 },
  button: { marginTop: 16 },
  swipeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
  },
});
