import { ProductsStackParamList } from "@/components/layouts/ManagerLayout";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { View, FlatList, Alert } from "react-native";
import { Button, Card } from "react-native-paper";
import MultiSelectWithChips from "@/components/select/MultiSelectWithChips";
import LoadingSpin from "@/components/LoadingSpin";
import { useFocusEffect } from "@react-navigation/native";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

type ProductsProps = NativeStackScreenProps<
  ProductsStackParamList,
  "ProductsMain"
>;

// Memoized Product Card
const ProductCard: React.FC<{
  product: Types.Product.ProductType;
  onEdit: (product: Types.Product.ProductType) => void;
  onToggleActive: (product: Types.Product.ProductType) => void;
  onDelete: (product: Types.Product.ProductType) => void;
}> = React.memo(({ product, onEdit, onToggleActive, onDelete }) => {
  return (
    <Card style={{ marginBottom: 12 }}>
      <Card.Title
        title={`${product.name} - ${product.store.name}`}
        subtitle={`Price: $${product.price} • ${
          product.is_active ? "Active" : "Inactive"
        }`}
      />
      <Card.Actions>
        <Button onPress={() => onEdit(product)}>Edit</Button>
        <Button onPress={() => onToggleActive(product)}>
          {product.available ? "Deactivate" : "Activate"}
        </Button>
        <Button onPress={() => onDelete(product)}>Delete</Button>
      </Card.Actions>
    </Card>
  );
});

const ProductsScreen = ({ navigation }: ProductsProps) => {
  const [stores, setStores] = useState<Types.Store.StoreType[]>([]);
  const [selectedStores, setSelectedStores] = useState<Types.Store.StoreType[]>(
    []
  );
  const [products, setProducts] = useState<Types.Product.ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load stores once
  useEffect(() => {
    (async () => {
      try {
        const storeData = await Services.Store.getStores(axiosInstance, {});
        setStores(storeData.result ?? []);
      } catch (err) {
        console.error("Failed to load stores", err);
      }
    })();
  }, []);

  // Fetch products for selected stores
  const fetchProducts = useCallback(async () => {
    if (selectedStores.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const allProducts: Types.Product.ProductType[] = [];
      for (const store of selectedStores) {
        const response = await Services.Product.getUserProductsStore(
          axiosInstance,
          store._id
        );
        if (response.result) allProducts.push(...response.result);
      }
      setProducts(allProducts);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  }, [selectedStores]);

  // Refresh products
  const handleRefreshProducts = useCallback(async () => {
    if (!selectedStores.length) return;
    setRefreshing(true);
    try {
      const response = await Services.Product.getUserProductsStores(
        axiosInstance,
        selectedStores
      );
      setProducts(response ?? []);

      const storeData = await Services.Store.getStores(axiosInstance, {});
      setStores(storeData.result ?? []);
    } catch (err) {
      console.error("Failed to refresh products", err);
    } finally {
      setRefreshing(false);
    }
  }, [selectedStores]);

  // Refresh products on focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [fetchProducts])
  );

  // Handlers
  const handleAddProduct = useCallback(() => {
    navigation.navigate("AddProduct");
  }, [navigation]);

  const handleEditProduct = useCallback(
    (product: Types.Product.ProductType) => {
      navigation.navigate("EditProduct", { product });
    },
    [navigation]
  );

  const handleToggleActive = useCallback(
    async (product: Types.Product.ProductType) => {
      try {
        const newAvailable = !product.available;
        await Services.Product.updateProduct(axiosInstance, product._id, {
          available: newAvailable,
        });
        await handleRefreshProducts();
      } catch (err) {
        console.error("Failed to update availability", err);
        Alert.alert("Error", "Could not update product availability.");
      }
    },
    [handleRefreshProducts]
  );

  const handleDeleteProduct = useCallback(
    (product: Types.Product.ProductType) => {
      Alert.alert(
        "Delete Product",
        `Are you sure you want to delete ${product.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
              try {
                await Services.Product.deleteProduct(
                  axiosInstance,
                  product._id
                );
                await handleRefreshProducts();
                Alert.alert("Success", "Product deleted successfully");
              } catch (err) {
                console.error("Failed to delete product", err);
                Alert.alert(
                  "Error",
                  "Could not delete product. Please try again."
                );
              }
            },
          },
        ]
      );
    },
    [handleRefreshProducts]
  );

  // Memoized header component
  const ListHeader = useMemo(
    () => (
      <View>
        <MultiSelectWithChips<Types.Store.StoreType>
          label="Select Stores"
          options={stores}
          selected={selectedStores}
          onChange={setSelectedStores}
          mapper={{
            getId: (s) => s._id,
            getLabel: (s) => s.name,
          }}
          allowCreate={false}
        />

        <Button
          mode="contained"
          style={{ marginVertical: 16 }}
          onPress={handleAddProduct}
          disabled={!selectedStores.length}
        >
          Add New Product
        </Button>
      </View>
    ),
    [stores, selectedStores, handleAddProduct]
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingSpin />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ padding: 16 }}
      refreshing={refreshing}
      onRefresh={handleRefreshProducts}
      ListHeaderComponent={ListHeader}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onEdit={handleEditProduct}
          onToggleActive={handleToggleActive}
          onDelete={handleDeleteProduct}
        />
      )}
    />
  );
};

export default React.memo(ProductsScreen);
