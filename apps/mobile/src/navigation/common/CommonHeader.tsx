import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

export const CustomHeader: React.FC<NativeStackHeaderProps> = ({
  navigation,
  options,
  back,
}) => {
  return (
    <View style={styles.header}>
      {back && (
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{options.title || "Title"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 40,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 16 },
  title: { fontSize: 18, fontWeight: "bold" },
});
