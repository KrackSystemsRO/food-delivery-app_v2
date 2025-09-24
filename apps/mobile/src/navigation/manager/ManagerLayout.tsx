import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ManagerTabs from "./ManagerTabs";

export default function ManagerLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ManagerTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1d1d1d" },
  content: { flex: 1 },
});
