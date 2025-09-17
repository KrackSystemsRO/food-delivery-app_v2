import React from "react";
import { Alert } from "react-native";
import ProductForm from "@/components/ProductForm";
import { updateProduct } from "@/services/product.service";
import { RouteProp } from "@react-navigation/native";
import { ProductsStackParamList } from "@/components/layouts/ManagerLayout";

type EditProductScreenProps = {
  route: RouteProp<ProductsStackParamList, "EditProduct">;
  navigation: any;
};

const EditProductScreen = ({ route, navigation }: EditProductScreenProps) => {
  const { product } = route.params;

  const handleUpdate = async (payload: any) => {
    await updateProduct(product._id, payload);
    Alert.alert("Success", "Product updated successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ProductForm mode="edit" initialValues={product} onSubmit={handleUpdate} />
  );
};

export default EditProductScreen;
