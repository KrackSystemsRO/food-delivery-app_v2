import { Alert } from "react-native";
import ProductForm from "@/components/ProductForm";
import { RouteProp } from "@react-navigation/native";
import { ProductsStackParamList } from "@/navigation/manager/types";
import axiosInstance from "@/utils/request/authorizedRequest";
import { Services } from "@my-monorepo/shared";

type EditProductScreenProps = {
  route: RouteProp<ProductsStackParamList, "EditProduct">;
  navigation: any;
};

const EditProductScreen = ({ route, navigation }: EditProductScreenProps) => {
  const { product } = route.params;

  const handleUpdate = async (payload: any) => {
    await Services.Product.updateProduct(axiosInstance, product._id, payload);
    Alert.alert("Success", "Product updated successfully", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <ProductForm mode="edit" initialValues={product} onSubmit={handleUpdate} />
  );
};

export default EditProductScreen;
