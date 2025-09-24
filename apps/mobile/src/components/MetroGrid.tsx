import { View, StyleSheet } from "react-native";
import UtilityManager from "@/components/UtilityManager";

export default function MetroGrid() {
  return (
    <View style={styles.screen}>
      <UtilityManager snapToGrid={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
});
