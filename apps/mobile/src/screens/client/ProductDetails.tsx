import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StoresStackParamList } from "@/types/navigation.type";
import { useCart } from "../../context/CartContext";
import { fetchCart } from "../../services/cart.service";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";

type Props = NativeStackScreenProps<StoresStackParamList, "ProductDetails">;

export default function ProductDetailsScreen({ route, navigation }: Props) {
  const { product } = route.params;
  const { dispatch, syncAddToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  const { t } = useTranslation();

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  useEffect(() => {
    const initCart = async () => {
      try {
        const cart = await fetchCart();
        dispatch({
          type: "SET_CART",
          cart: {
            store: cart.store,
            items: cart.items.map((i: any) => ({
              product: i.product._id,
              name: i.product.name,
              price: i.product.price,
              quantity: i.quantity,
              observations: i.observations,
            })),
          },
        });
      } catch (err) {
        console.log("No cart found");
      }
    };

    initCart();
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: product.name });
  }, [navigation, product.name]);

  const addToCart = async () => {
    try {
      if (product.store.is_open === true) {
        const success = await syncAddToCart(
          {
            product: product._id,
            name: product.name,
            price: product.price,
            quantity,
            observations,
          },
          product.store._id
        );

        if (!success) {
          showToast("error", "Oops!", "Failed to add item.");
          return;
        }

        showToast("success", "Yeey!", "Item added to cart.");
        setQuantity(1);
        setObservations("");
      } else {
        showToast(
          "error",
          "Oh no!",
          "The store is closed right now. Try again later."
        );
        setQuantity(1);
        setObservations("");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", "Oops!", "Unexpected error occurred.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{
          uri: "https://www.lensofalex.com/wp-content/uploads/2020/03/Food-NAZ-Lens-of-Alex-014.jpg",
        }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          {t("common.currency.symbol")}
          {product.price.toFixed(2)}
        </Text>

        <Text
          style={[
            styles.availability,
            { color: product.available ? "#4CAF50" : "#F44336" },
          ]}
        >
          {product.available
            ? t("common.message.available")
            : t("common.message.not_available")}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyButton}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.qtyButton}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          placeholder={t("common.message.special_requests")}
          value={observations}
          onChangeText={setObservations}
          style={styles.input}
          multiline
        />

        <TouchableOpacity
          onPress={addToCart}
          style={[styles.addButton, { opacity: product.available ? 1 : 0.6 }]}
          disabled={!product.available}
        >
          <Text style={styles.addButtonText}>
            {t("cart.buttons.add_to_cart")}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#222",
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
    marginBottom: 12,
  },
  availability: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  qtyButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  qtyNumber: {
    marginHorizontal: 16,
    fontSize: 18,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 60,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 4,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
