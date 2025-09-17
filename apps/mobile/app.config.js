import "dotenv/config";

export default {
    expo: {
        name: "food-delivery-client",
        slug: "food-delivery-client",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        jsEngine: "hermes",

        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },

        ios: {
            bundleIdentifier: "com.yourcompany.fooddeliveryclient",
            supportsTablet: true,
            infoPlist: {
                UIBackgroundModes: ["fetch", "remote-notification"],
            },
        },

        android: {
            package: "com.yourcompany.fooddeliveryclient",
            versionCode: 1,
            jsEngine: "hermes",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff",
            },
            edgeToEdgeEnabled: true,
            permissions: ["NOTIFICATIONS"],
        },

        web: {
            favicon: "./assets/favicon.png",
        },

        extra: {
            API_URL: process.env.API_URL,
            eas: {
                projectId: "0674b90b-9167-426f-98a1-ac691c4ccef5",
            },
        },

        plugins: [
            [
                "expo-notifications",
                {
                    // Optional: configure default notification channel
                },
            ],
        ],
    },
};
