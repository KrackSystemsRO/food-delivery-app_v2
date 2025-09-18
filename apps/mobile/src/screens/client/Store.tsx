import { useEffect, useState, useCallback } from "react";
import { FlatList, TouchableOpacity, StyleSheet, View } from "react-native";
import { Text, Card } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StoresStackParamList } from "@/types/navigation.type";
import LoadingSpin from "../../components/LoadingSpin";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

export default function Stores() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StoresStackParamList, "Stores">>();
  const [stores, setStores] = useState<Types.Store.StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStores = async () => {
    try {
      const response = await Services.Store.getStores(axiosInstance, {
        is_active: true,
      });
      if (response.status === 200) {
        setStores(response.result);
      } else {
        console.error("Failed to load stores:", response.message);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStores();
  }, []);

  const handlePress = (store: Types.Store.StoreType) => {
    navigation.navigate("StoreDetails", { store });
  };

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <FlatList
      data={stores}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
          <Card style={styles.card}>
            <Card.Cover
              source={{
                uri: "https://img.freepik.com/free-photo/shop-interior_1127-3394.jpg?semt=ais_hybrid&w=740",
              }}
            />
            <Card.Content>
              <Text variant="titleMedium">{item.name}</Text>
              <Text variant="bodySmall" style={styles.address}>
                {item.address}
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.is_active,
                  { color: item.is_open ? "green" : "red" },
                ]}
              >
                {item.is_open ? "Open" : "Closed"}
              </Text>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium" style={styles.emptyText}>
            No stores available
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16, flexGrow: 1 },
  card: { marginBottom: 16, borderRadius: 12, overflow: "hidden" },
  address: { color: "gray" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 50 },
  emptyText: { color: "gray" },
  is_active: { marginTop: 4, fontWeight: "600" },
});
