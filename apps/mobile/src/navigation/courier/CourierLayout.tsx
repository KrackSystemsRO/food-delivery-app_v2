import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CourierTabs from "./CourierTabs";

export default function CourierLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CourierTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
