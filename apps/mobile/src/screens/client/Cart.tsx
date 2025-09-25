import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useCart } from "../../context/CartContext";
import { showToast } from "../../utils/toast";
import { useTranslation } from "react-i18next";
import {
  GestureHandlerRootView,
  RefreshControl,
} from "react-native-gesture-handler";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { useAuth } from "@/context/authContext";
import { Picker } from "@react-native-picker/picker";

export default function CartScreen() {
  const { user } = useAuth();
  const { state, dispatch, syncUpdateQuantity, refreshCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deliveryLocations, setDeliveryLocations] = useState<
    Types.DeliveryLocation.DeliveryLocation[]
  >([]);
  const [selectedLocationId, setSelectedLocationId] =
    useState<Types.DeliveryLocation.DeliveryLocation>();

  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;
    setDeliveryLocations(user.deliveryLocations);
  }, [user]);

  useEffect(() => {
    console.log(selectedLocationId);
  }, [selectedLocationId]);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 5;
  const total = subtotal + deliveryFee;

  const handleRemoveItem = async (product: string) => {
    try {
      setLoading(true);
      await Services.Cart.removeItemFromCart(axiosInstance, product);
      dispatch({
        type: "SET_CART",
        cart: {
          ...state,
          items: state.items.filter((i) => i.product !== product),
        },
      });
    } catch (err) {
      showToast("error", "Oops!", "Failed to remove item.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setLoading(true);
      await Services.Cart.clearCart(axiosInstance);
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      showToast("error", "Oops!", "Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);

      if (state.items.length === 0) {
        showToast(
          "info",
          "Cart is empty!",
          "Please add items before ordering."
        );
        return;
      }

      if (!state.store) {
        showToast("error", "Oops!", "No store selected.");
        return;
      }

      if (!selectedLocationId) {
        showToast("error", "Oops!", "No delivery location was selected.");
        return;
      }

      const itemsToOrder = state.items.map((item: Types.Cart.CartItemType) => ({
        product: item.product,
        quantity: item.quantity,
        observations: item.observations,
        price: item.price,
      }));

      const deliveryLocationObject = deliveryLocations.find(
        (el) => el._id === selectedLocationId
      );

      if (!deliveryLocationObject) {
        showToast("error", "Oops!", "Please select a delivery location.");
        return;
      }

      const orderData = {
        store: state.store,
        items: itemsToOrder,
        deliveryLocation: deliveryLocationObject,
      };

      await Services.Order.placeOrder(axiosInstance, orderData);
      await Services.Cart.clearCart(axiosInstance);
      setSelectedLocationId(undefined);
      dispatch({ type: "CLEAR_CART" });

      showToast("success", "Yeey!", "Your order has been placed!");
    } catch (err) {
      console.error("Order placement failed:", err);
      showToast("error", "Oops!", "Could not place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshCart();
    } catch (err) {
      showToast("error", "Oops!", "Failed to refresh cart.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {state.items.length !== 0 && (
          <View
            style={{
              margin: 16,
              borderWidth: 1,
              borderRadius: 6,
              borderColor: "#ccc",
            }}
          >
            <Picker
              selectedValue={selectedLocationId}
              onValueChange={(value) => setSelectedLocationId(value)}
              style={{ height: 50 }}
            >
              <Picker.Item
                label="Select delivery location..."
                value={undefined}
              />
              {deliveryLocations.map((loc) => (
                <Picker.Item
                  key={loc._id}
                  label={`${loc.label} — ${loc.address}`}
                  value={loc._id} // just the id
                />
              ))}
            </Picker>
          </View>
        )}
        {state.items.length === 0 ? (
          <Text style={styles.empty}>{t("cart.message.cart_empty")}</Text>
        ) : (
          <View>
            {state.items.map((item) => (
              <View key={item.product} style={styles.itemRow}>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveItem(item.product)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.remove}>
                    {t("common.buttons.remove")}
                  </Text>
                </TouchableOpacity>

                <View style={styles.itemContent}>
                  <View style={styles.inlineRow}>
                    <Image
                      source={{
                        uri:
                          item.image?.trim() ||
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg",
                      }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemTextContainer}>
                      <Text style={styles.itemName}>
                        {item.quantity} X {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>
                        {t("common.currency.symbol")}
                        {(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.quantityWrapper}>
                    <View style={styles.quantityRow}>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          item.quantity > 1
                            ? syncUpdateQuantity(
                                item.product,
                                item.quantity - 1
                              )
                            : handleRemoveItem(item.product)
                        }
                      >
                        <Text style={styles.qtyText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyValue}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        onPress={() =>
                          syncUpdateQuantity(item.product, item.quantity + 1)
                        }
                      >
                        <Text style={styles.qtyText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {item.observations ? (
                    <Text style={styles.observations}>
                      {t("common.heading.cart.notes")}: {item.observations}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}

            <View style={styles.summary}>
              <Text style={styles.summaryText}>
                {t("common.heading.cart.subtotal")}:{" "}
                {t("common.currency.symbol")}
                {subtotal.toFixed(2)}
              </Text>
              <Text style={styles.summaryText}>
                {t("common.heading.cart.delivery_fee")}:
                {t("common.currency.symbol")}
                {deliveryFee.toFixed(2)}
              </Text>
              <Text style={styles.totalText}>
                {t("common.heading.cart.total")}: {t("common.currency.symbol")}
                {total.toFixed(2)}
              </Text>

              <TouchableOpacity
                style={styles.placeOrderBtn}
                onPress={handlePlaceOrder}
              >
                <Text style={styles.btnText}>
                  {t("common.buttons.place_order")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleClearCart}>
                <Text style={styles.clearCart}>
                  {t("cart.buttons.clear_cart")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  itemContent: {
    flex: 1,
    width: "100%",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  empty: {
    fontSize: 16,
    color: "#777",
  },
  itemRow: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  observations: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  itemPrice: {
    fontSize: 16,
    color: "#4CAF50",
    marginTop: 4,
  },
  summary: {
    marginTop: 40,
    marginBottom: 40,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 16,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  placeOrderBtn: {
    marginTop: 16,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearCart: {
    marginTop: 12,
    color: "#F44336",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  qtyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: "500",
    minWidth: 24,
    textAlign: "center",
  },
  quantityWrapper: {
    width: "100%",
    alignSelf: "stretch",
    marginTop: 8,
    borderColor: "#eee",
  },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8, // Add a little margin from the edge
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#d9534f", // Red color for 'Remove'
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",

    // Optional shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Optional elevation for Android
    elevation: 3,
  },
  remove: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 12,
  },
  subHeading: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
});
