import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { showToast } from "@/utils/toast";
import { register } from "@/services/authentication.service";

export default function RegisterPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login: loginWithToken } = useAuth();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { accessToken, refreshToken } = await register({
        email,
        firstName,
        lastName,
        password,
      });

      loginWithToken(accessToken, refreshToken);
      showToast(
        "success",
        t("register.message.success") || "Registration successful"
      );
      navigate("/");
    } catch (error: any) {
      showToast(
        "error",
        t("register.message.failed") || "Registration failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>{t("register.title") || "Create Account"}</CardTitle>
              <CardDescription>
                {t("register.description") || "Fill in the form to register."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="firstName">
                      {t("common.form.label.firstName") || "First Name"}
                    </Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="lastName">
                      {t("common.form.label.lastName") || "Last Name"}
                    </Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {t("common.form.label.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">
                      {t("common.form.label.password")}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">
                      {t("common.form.label.confirmPassword") ||
                        "Confirm Password"}
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? t("common.form.button.loading") || "Registering..."
                      : t("common.form.button.signUp") || "Sign Up"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t("register.question.haveAccount") ||
                    "Already have an account?"}{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    {t("common.form.button.login")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
