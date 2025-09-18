import * as Notifications from "expo-notifications";

import { Platform } from "react-native";
// 🔔 Setup default handler for both iOS & Android
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,

    // iOS 15+ specific
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  // iOS: request permissions
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permissions not granted");
  }

  // Android: create a default channel (must have sound set here)
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default", // could be a custom sound file
    });
  }
}

export async function sendNotification(
  title: string,
  body: string,
  sound: boolean = true
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound, // true = default sound
    },
    trigger: null,
  });
}
