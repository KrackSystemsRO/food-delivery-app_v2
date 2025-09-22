import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClientTabs from "./ClientTabs";

export default function ClientLayout() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ClientTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
