// LoadingScreen.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/animations/scooter.json")}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>Delivering your experience...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 250,
    height: 250,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#FF5722",
    fontWeight: "600",
  },
});
