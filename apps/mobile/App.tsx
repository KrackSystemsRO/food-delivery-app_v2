import "./src/utils/translationLocales/i18n";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/authContext";
import RootNavigator from "./src/navigation/RootNavigator";
import Toast from "react-native-toast-message";
import { CartProvider } from "./src/context/CartContext";
import { LanguageProvider } from "./src/context/LanguageContext";
import { Provider as PaperProvider } from "react-native-paper";

function AppContent() {
  return (
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
  );
}

export default AppContent;
