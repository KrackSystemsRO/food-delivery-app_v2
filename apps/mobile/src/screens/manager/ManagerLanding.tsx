import { StyleSheet, View } from "react-native";
import MetroGrid from "@/components/gridLandingComponents/MetroGrid";

export default function ManagerLandingScreen() {
  return (
    <View style={styles.screen}>
      <MetroGrid />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
});
