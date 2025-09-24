import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useTranslation } from "react-i18next";
import DeliveryLocationManager from "@/components/map/DeliveryLocationsManager";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import LoadingSpin from "@/components/LoadingSpin";
import { useAuth } from "@/context/authContext";

export default function DeliveryLocationsScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locations, setLocations] = useState<
    Types.DeliveryLocation.DeliveryLocation[]
  >([]);

  const { t } = useTranslation();

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

  const fetchLocations = async () => {
    setRefreshing(true);
    try {
      const response = await Services.DeliveryLocation.getDeliveryLocations(
        axiosInstance,
        { order: "asc" }
      );
      if (response?.status === 200) {
        setLocations(response.result || []);
      }
    } catch (error) {
      console.error("Failed to fetch locations:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

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

  const handleDeleteLocation = async (id: string) => {
    try {
      const response = await Services.DeliveryLocation.deleteDeliveryLocation(
        axiosInstance,
        id
      );
      if (response && response.status === 200) {
        // setLocations(response.result || []);
        fetchLocations();
      } else {
        console.warn("Failed to delete location:", response.message);
      }
    } catch (error) {
      console.error("Error deleteing location:", error);
    }
  };

  if (loading) return <LoadingSpin />;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchLocations} />
      }
    >
      <Text style={styles.heading}>{t("locations.manage_locations")}</Text>

      <DeliveryLocationManager
        deliveryLocations={locations}
        onSave={(loc) => handleSaveLocation(loc)}
        onDelete={(id) => handleDeleteLocation(id)}
        isDisplayList={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 50 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
});
