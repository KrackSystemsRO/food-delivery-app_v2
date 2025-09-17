import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StoresStackParamList } from "@/types/navigation.type";
import { getListProductsStore } from "../../services/product.service";
import LoadingSpin from "../../components/LoadingSpin";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";

type Props = NativeStackScreenProps<StoresStackParamList, "StoreDetails">;

export default function StoreDetailsScreen({ route, navigation }: Props) {
  const { store } = route.params;
  const [products, setProducts] = useState<Types.Product.ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getListProductsStore(store._id);
      if (response.status === 200) {
        setProducts(response.result);
      } else {
        console.error("Failed to load products:", response.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [store._id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    navigation.setOptions({ title: store.name });
  }, [navigation, store.name]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  const renderHeader = () => (
    <View>
      <Image
        source={{
          uri: "https://img.freepik.com/free-photo/shop-interior_1127-3394.jpg?semt=ais_hybrid&w=740",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{store.name}</Text>
        <Text style={styles.address}>{store.address}</Text>
        <Text style={styles.description}>{store.description}</Text>
      </View>
      {products.length !== 0 ? (
        <View style={styles.productSection}>
          <Text style={styles.productTitle}>
            {t("common.heading.products") || "Products"}
          </Text>
          {loading && <LoadingSpin />}
        </View>
      ) : (
        <>
          {loading ? (
            <LoadingSpin />
          ) : (
            <Text style={styles.productTitle}>
              {t("common.heading.no_products") || "No products yet"}
            </Text>
          )}
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetails", { product: item })
          }
          style={styles.productCard}
        >
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>
              {item.description || t("common.message.no_description")}
            </Text>
            <Text style={styles.productPrice}>
              {t("common.currency.symbol")}
              {item.price.toFixed(2)}
            </Text>
          </View>
          <Image
            source={{
              uri: item.image?.trim()
                ? item.image
                : "https://www.lensofalex.com/wp-content/uploads/2020/03/Food-NAZ-Lens-of-Alex-014.jpg",
            }}
            style={styles.productImage}
          />
        </TouchableOpacity>
      )}
      contentContainerStyle={{ padding: 16 }}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: "100%", height: 200 },
  content: { padding: 16 },
  name: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  address: { fontSize: 16, color: "gray", marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 22 },
  productSection: { padding: 16 },
  productTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  productName: { fontSize: 16 },
  productPrice: { fontSize: 14, color: "gray", fontWeight: "bold" },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#f8f8f8",
    marginBottom: 10,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginRight: 10,
  },
  productDescription: {
    fontSize: 14,
    color: "gray",
    marginVertical: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
});
