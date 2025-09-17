import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

type AnimatedBadgeProps = {
  count: number;
};

export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({ count }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animate scale up and back on count change
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count]);

  if (count === 0) return null;

  return (
    <Animated.View style={[styles.badgeContainer, { transform: [{ scale }] }]}>
      <Text style={styles.badgeText}>{count}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    position: "absolute",
    right: -16,
    top: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "tomato",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});
