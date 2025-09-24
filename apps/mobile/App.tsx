import "./src/utils/translationLocales/i18n";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/authContext";
import RootNavigator from "./src/navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { CartProvider } from "./src/context/CartContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function AppContent() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              <PaperProvider>
                <RootNavigator />
                <Toast />
              </PaperProvider>
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default AppContent;
