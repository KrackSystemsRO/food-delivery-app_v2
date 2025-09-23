import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import DeliveryLocationManager from "@/components/DeliveryLocationsManager";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import LoadingSpin from "@/components/LoadingSpin";
import { useAuth } from "@/context/authContext";

export default function DeliveryLocationsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<
    Types.DeliveryLocation.DeliveryLocation[]
  >([]);

  const { t } = useTranslation();

  // Fetch user's delivery locations on mount
  useEffect(() => {
    if (!user) return;
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await Services.DeliveryLocation.getDeliveryLocations(
          axiosInstance,
          { order: "asc" }
        );
        if (response && response.status === 200) {
          setLocations(response.result || []);
        }
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [user]);

  // Save a new location
  const handleSaveLocation = async (
    newLocation: Types.DeliveryLocation.DeliveryLocation
  ) => {
    try {
      const response = await Services.DeliveryLocation.addDeliveryLocation(
        axiosInstance,
        newLocation
      );
      if (response && response.status === 201) {
        setLocations(response.result || []);
      } else {
        console.warn("Failed to add location:", response.message);
      }
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  if (loading) return <LoadingSpin />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t("locations.manage_locations")}</Text>

      <DeliveryLocationManager
        deliveryLocations={locations}
        onSave={handleSaveLocation}
        isDisplayList={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 50 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
});
