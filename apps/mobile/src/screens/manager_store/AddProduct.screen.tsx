import React from "react";
import { Alert } from "react-native";
import ProductForm from "@/components/ProductForm";
import {
  CreateProductPayload,
  saveNewProduct,
} from "@/services/product.service";

const AddProductScreen = ({ navigation }: any) => {
  const handleSave = async (payload: CreateProductPayload) => {
    await saveNewProduct(payload);
    Alert.alert("Success", "Product created successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return <ProductForm mode="add" onSubmit={handleSave} />;
};

export default AddProductScreen;
