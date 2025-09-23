import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { useAuth } from "../../context/authContext";
import LoadingSpin from "../../components/LoadingSpin";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/components/buttons/LanguageSwitch";
import DeliveryLocationManager from "@/components/DeliveryLocationsManager";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "@/navigation/common/ProfileStack";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <LoadingSpin />;
  if (!user)
    return (
      <View style={styles.center}>
        <Text>{t("common.massage.no_data_available")}</Text>
      </View>
    );

  const ListHeader = () => (
    <View style={{ padding: 16 }}>
      <Text style={styles.label}>{t("common.labels.name")}:</Text>
      <Text style={styles.value}>
        {user.first_name} {user.last_name}
      </Text>

      <Text style={styles.label}>{t("common.labels.email")}:</Text>
      <Text style={styles.value}>{user.email}</Text>

      <Text style={styles.label}>{t("common.labels.phone")}:</Text>
      <Text style={styles.value}>{user.phone_number}</Text>

      <Text style={styles.label}>{t("common.labels.role")}:</Text>
      <Text style={styles.value}>{user.role}</Text>

      <Text style={styles.label}>{t("common.labels.company")}:</Text>
      <Text style={styles.value}>
        {(user?.company && user?.company[0]?.name) || "N/A"}
      </Text>

      <Text style={styles.label}>{t("common.labels.department")}:</Text>
      <Text style={styles.value}>
        {(user?.department && user?.department[0]?.name) || "N/A"}
      </Text>

      <LanguageSwitch />
    </View>
  );

  return (
    <>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <ListHeader />

        {/* Navigate to dedicated locations page */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: "#5cb85c" }]}
          onPress={() => navigation.navigate("DeliveryLocations")}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            {t("locations.manage_locations")}
          </Text>
        </TouchableOpacity>

        {/* Logout button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            {t("common.buttons.logout")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  locationItem: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalMessage: { fontSize: 16, marginBottom: 20, color: "#555" },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end" },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: "#e0e0e0" },
  cancelButtonText: { color: "#333", fontWeight: "bold" },
  confirmButton: { backgroundColor: "#d9534f" },
  confirmButtonText: { color: "#fff", fontWeight: "bold" },
});
