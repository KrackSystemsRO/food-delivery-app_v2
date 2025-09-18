import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { useAuth } from "../../context/authContext";
import LoadingSpin from "../../components/LoadingSpin";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "@/components/buttons/LanguageSwitch";

export default function ProfileScreen() {
  const { logout, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    if (user) setLoading(false);
  }, [user]);

  const handleLogout = () => {
    setModalVisible(false);
    logout();
  };

  if (loading) {
    return <LoadingSpin />;
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>{t("common.massage.no_data_available")}</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.screenContainer}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
        >
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
            {(user?.department &&
              user?.department &&
              user?.department[0]?.name) ||
              "N/A"}
          </Text>

          <LanguageSwitch />
        </ScrollView>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>
            {t("common.buttons.logout")}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {t("common.modal.logout.heading")}
            </Text>
            <Text style={styles.modalMessage}>
              {t("common.modal.logout.question")}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {t("common.buttons.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>
                  {t("common.buttons.logout")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  content: { paddingBottom: 40 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
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
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
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
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: "#555",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#d9534f",
  },
  confirmButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
});
