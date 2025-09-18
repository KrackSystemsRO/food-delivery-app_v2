import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../context/authContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "@/types/navigation.type";
import { default as authorizedRequest } from "@/utils/request/authorizedRequest";
import { default as request } from "@/utils/request/request";
import { Services } from "@my-monorepo/shared";

export default function LoginScreen() {
  const { login: loginWithToken, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await Services.Auth.login(request, {
        email,
        password,
      });
      loginWithToken(response.accessToken, response.refreshToken);
      setUser((await Services.User.getUserDetails(authorizedRequest)).result);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        {t("login.title")}
      </Text>
      <TextInput
        label={t("common.labels.email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label={t("common.labels.password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        right={
          <TextInput.Icon
            icon={showPassword ? "eye-off" : "eye"}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        {t("common.buttons.login")}
      </Button>

      <Button
        onPress={() => navigation.navigate("Register")}
        style={styles.link}
      >
        {t("common.buttons.register.to_register")}
      </Button>

      {/* Added Recover Password button */}
      <Button
        onPress={() => navigation.navigate("Recover")}
        style={styles.link}
      >
        {t("common.buttons.recover.to_recover")}
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
});
