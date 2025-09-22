import { Alert } from "react-native";
import ProductForm from "@/components/ProductForm";
import { Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

const AddProductScreen = ({ navigation }: any) => {
  const handleSave = async (payload: Services.Product.CreateProductPayload) => {
    await Services.Product.addProduct(axiosInstance, payload);
    Alert.alert("Success", "Product created successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return <ProductForm mode="add" onSubmit={handleSave} />;
};

export default AddProductScreen;
