import React, { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import LoadingScreen from "../LoadingScreen";

type Props = {
  loading: boolean;
  onFinish: () => void;
};

export default function FadeOutLoading({ loading, onFinish }: Props) {
  const [visible, setVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 2000, // fade duration
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onFinish();
      });
    }
  }, [loading]);

  if (!visible) return null;

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LoadingScreen />
    </Animated.View>
  );
}
