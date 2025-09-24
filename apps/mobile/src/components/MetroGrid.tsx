import { View, StyleSheet } from "react-native";
import UtilityManager from "@/components/UtilityManager";
import { useNavigation } from "@react-navigation/native";
import { ManagerTabsParamList } from "@/navigation/types";

export default function MetroGrid() {
  const navigation = useNavigation<ManagerTabsParamList>();
  return (
    <View style={styles.screen}>
      <UtilityManager snapToGrid={true} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
});
