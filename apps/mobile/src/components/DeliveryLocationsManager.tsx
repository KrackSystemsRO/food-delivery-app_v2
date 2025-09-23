import { useState } from "react";
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
} from "react-native";
import MapPicker from "./MapPicker";
import { Types } from "@my-monorepo/shared";

interface DeliveryLocationManagerProps {
  deliveryLocations: Types.DeliveryLocation.DeliveryLocation[];
  onSave: (location: Types.DeliveryLocation.DeliveryLocation) => void;
  isDisplayList?: boolean;
}

export default function DeliveryLocationManager({
  deliveryLocations,
  onSave,
  isDisplayList = false,
}: DeliveryLocationManagerProps) {
  const [formData, setFormData] = useState<
    Partial<Types.DeliveryLocation.DeliveryLocation>
  >({});
  const [showMap, setShowMap] = useState(false);

  const handleSave = () => {
    if (!formData.label || !formData.address) return;
    onSave(formData as Types.DeliveryLocation.DeliveryLocation);
    setFormData({});
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
      {/* Button to open Map */}
      <Button title="Pick Location on Map" onPress={() => setShowMap(true)} />
      {/* Selected Address */}
      {formData.address && (
        <Text style={styles.selectedAddress}>Selected: {formData.address}</Text>
      )}
      <Button title="Save Location" onPress={handleSave} />
      {/* Delivery Locations List */}
      {isDisplayList && (
        <FlatList<Types.DeliveryLocation.DeliveryLocation>
          style={{ marginTop: 20 }}
          scrollEnabled={false} // Disable FlatList internal scroll to allow ScrollView
          data={deliveryLocations}
          keyExtractor={(item, index) => {
            if (item.locationId != null) return item.locationId.toString();
            if (item._id != null) return item._id.toString();
            return index.toString();
          }}
          renderItem={({ item }) => (
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>{item.label}</Text>
              <Text style={styles.locationAddress}>{item.address}</Text>
            </View>
          )}
        />
      )}
      {/* Map Modal */}
      <Modal visible={showMap} animationType="slide">
        <View style={{ flex: 1 }}>
          <MapPicker
            onSelectLocation={({ lat, lng, address }) => {
              setFormData({ ...formData, lat, lng, address });
              setShowMap(false);
            }}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 40,
              right: 20,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 10,
              borderRadius: 6,
            }}
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
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  locationLabel: { fontWeight: "600", fontSize: 16 },
  locationAddress: { color: "#555" },
});
