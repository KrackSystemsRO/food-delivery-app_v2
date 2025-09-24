import { useState } from "react";
import { View, StyleSheet } from "react-native";
import FlexMetroGrid, { MetroTile } from "@/components/FlexMetroGrid";
import { useNavigation } from "@react-navigation/native";
import type { ManagerTabsParamList } from "@/navigation/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<ManagerTabsParamList>;

export default function MetroGrid() {
  const navigation = useNavigation<NavigationProp>();

  const [tiles, setTiles] = useState<MetroTile[]>([
    {
      id: "orders",
      label: "Orders",
      color: "#0078D7",
      rowSpan: 1,
      colSpan: 1,
      onPress: () => navigation.navigate("OrdersStack"),
    },
    {
      id: "products",
      label: "Products",
      color: "#E81123",
      rowSpan: 1,
      colSpan: 2,
      onPress: () => navigation.navigate("ProductsStack"),
    },
    {
      id: "profile",
      label: "Profile",
      color: "#2D7D9A",
      rowSpan: 2,
      colSpan: 1,
      onPress: () => navigation.navigate("ProfileStack"),
    },
  ]);

  return (
    <View style={styles.screen}>
      <FlexMetroGrid
        tiles={tiles}
        editable={true}
        onTilesChange={(newTiles) => setTiles(newTiles)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
});
