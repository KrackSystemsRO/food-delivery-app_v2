import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/types/navigation.type";
import { Services } from "@my-monorepo/shared";
import { default as request } from "@/utils/request/request";

export default function RecoverPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleRecover = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await Services.Auth.forgotPassword(request, email);
      setMessage(t("recover.message.success"));
    } catch (err) {
      setError(t("recover.message.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {t("recover.title")}
      </Text>
      <TextInput
        label={t("common.labels.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      {message ? <Text style={styles.success}>{message}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleRecover}
        loading={loading}
        style={styles.button}
      >
        {t("common.buttons.recover.submit")}
      </Button>
      <Button onPress={() => navigation.navigate("Login")} style={styles.link}>
        {t("common.buttons.recover.back_to_login")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { marginBottom: 24, textAlign: "center" },
  input: { marginBottom: 12 },
  button: { marginTop: 12 },
  link: { marginTop: 8 },
  error: { color: "red", textAlign: "center", marginBottom: 8 },
  success: { color: "green", textAlign: "center", marginBottom: 8 },
});
