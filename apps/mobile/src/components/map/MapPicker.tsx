import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

import { GOOGLE_MAPS_API_KEY } from "@env";

Geocoder.init(GOOGLE_MAPS_API_KEY);

Geocoder.init("AIzaSyApEYIvmZAJgphA0WSj1LBBQwgrA3kMSbE"); // replace with your key

interface MapPickerProps {
  onSelectLocation: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
}

export default function MapPicker({ onSelectLocation }: MapPickerProps) {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [loading, setLoading] = useState(true);
  const [marker, setMarker] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        setLoading(false);
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = current.coords;
      setRegion((prev) => ({ ...prev, latitude, longitude }));
      setMarker({ latitude, longitude });
      setLoading(false);
    })();
  }, []);

  const handlePress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    try {
      const res = await Geocoder.from(latitude, longitude);
      const address = res.results[0]?.formatted_address || "Unknown Address";
      setSelectedAddress(address);
    } catch {
      setSelectedAddress("Unknown Address");
    }
  };

  const confirmSelection = () => {
    if (!marker) return;
    onSelectLocation({
      lat: marker.latitude,
      lng: marker.longitude,
      address: selectedAddress || "Unknown Address",
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        onPress={handlePress}
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>

      {/* Show the selected address and a confirm button when a pin is placed */}
      {marker && (
        <View style={styles.confirmBox}>
          <Text style={styles.addressText}>
            {selectedAddress || "Tap map to pick a location"}
          </Text>
          <Button title="Confirm Location" onPress={confirmSelection} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  confirmBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    elevation: 4,
  },
  addressText: { marginBottom: 8, textAlign: "center" },
});
