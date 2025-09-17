import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import LoginPage from "@/pages/Login";
import { AuthProvider } from "@/context/authContext";
import { Toaster } from "sonner";
import ForgotPasswordPage from "@/pages/ForgotPssword";
import RegisterPage from "@/pages/Register";
import UserManagementPage from "@/pages/Users";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import CompanyManagementPage from "@/pages/Companies";
import DepartmentManagementPage from "@/pages/Departments";
import StoreManagementPage from "@/pages/Stores";
import CategoryManagementPage from "@/pages/Category";
import IngredientManagementPage from "@/pages/Ingredients";
import AllergenManagementPage from "@/pages/Allergen";
import ProductManagementPage from "@/pages/Product";
import OrderManagementPage from "@/pages/Order";

export default function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<AuthenticatedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagementPage />} />
            <Route path="/companies" element={<CompanyManagementPage />} />
            <Route path="/departments" element={<DepartmentManagementPage />} />
            <Route path="/stores" element={<StoreManagementPage />} />
            <Route path="/categories" element={<CategoryManagementPage />} />
            <Route path="/ingredients" element={<IngredientManagementPage />} />
            <Route path="/allergens" element={<AllergenManagementPage />} />
            <Route path="/products" element={<ProductManagementPage />} />
            <Route path="/orders" element={<OrderManagementPage />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        <Toaster richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}
