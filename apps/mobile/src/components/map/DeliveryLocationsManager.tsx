import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import MapPicker from "./MapPicker";
import { Types } from "@my-monorepo/shared";
import { Icon, IconButton } from "react-native-paper";

interface DeliveryLocationManagerProps {
  deliveryLocations: Types.DeliveryLocation.DeliveryLocation[];
  onSave: (location: Types.DeliveryLocation.DeliveryLocation) => void;
  onDelete: (id: string) => void; // <-- NEW
  isDisplayList?: boolean;
}

export default function DeliveryLocationManager({
  deliveryLocations,
  onSave,
  onDelete,
  isDisplayList = false,
}: DeliveryLocationManagerProps) {
  const [formData, setFormData] = useState<
    Partial<Types.DeliveryLocation.DeliveryLocation>
  >({});
  const [showMap, setShowMap] = useState(false);

  const handleSave = () => {
    if (!formData.label || !formData.address) return;
    const payload = { ...formData } as Types.DeliveryLocation.DeliveryLocation;

    onSave(payload);
    setFormData({});
  };

  const handleDeleteLocation = (id: string) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => onDelete(id) },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Manage Delivery Locations</Text>

      <Text style={{ marginBottom: 5 }}>Nume adresa de livrare</Text>
      <TextInput
        style={styles.input}
        placeholder="Label"
        value={formData.label || ""}
        onChangeText={(text) => setFormData({ ...formData, label: text })}
      />

      <Button title="Pick Location on Map" onPress={() => setShowMap(true)} />

      {formData.address && (
        <Text style={styles.selectedAddress}>Selected: {formData.address}</Text>
      )}

      {formData.address && formData.lat && formData.lng && (
        <Button title="Save Location" onPress={handleSave} />
      )}

      {isDisplayList && (
        <FlatList<Types.DeliveryLocation.DeliveryLocation>
          style={{ marginTop: 20 }}
          scrollEnabled={false}
          data={deliveryLocations}
          keyExtractor={(item, index) => {
            if (item.locationId != null) return item.locationId.toString();
            if (item._id != null) return item._id.toString();
            return index.toString();
          }}
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>{item.label}</Text>
                <Text style={styles.locationAddress}>{item.address}</Text>
              </View>
              <View style={styles.actions}>
                <IconButton
                  icon="trash-can-outline"
                  size={20}
                  iconColor="white"
                  containerColor="#f44336"
                  onPress={() =>
                    handleDeleteLocation(
                      item._id ?? item.locationId?.toString() ?? ""
                    )
                  }
                />
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={showMap} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapPicker
            onSelectLocation={({ lat, lng, address }) => {
              setFormData({ ...formData, lat, lng, address });
              setShowMap(false);
            }}
          />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowMap(false)}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 6,
  },
  selectedAddress: { marginVertical: 10, fontStyle: "italic" },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  locationLabel: { fontWeight: "600", fontSize: 16 },
  locationAddress: { color: "#555" },
  actions: { flexDirection: "row", gap: 8 },
  editButton: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  btnText: { color: "#fff" },
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 6,
  },
});
