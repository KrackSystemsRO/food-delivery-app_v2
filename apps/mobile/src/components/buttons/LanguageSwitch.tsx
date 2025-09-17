import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();

  const isRomanian = language === "ro";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t("common.labels.language")}:</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isRomanian ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleLanguage}
        value={isRomanian}
      />
      <Text style={styles.languageText}>{isRomanian ? "RO" : "EN"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginRight: 8,
  },
  languageText: {
    marginLeft: 8,
    fontWeight: "bold",
  },
});
