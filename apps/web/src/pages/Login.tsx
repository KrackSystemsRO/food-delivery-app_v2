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
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { showToast } from "@/utils/toast";
import { Services } from "@my-monorepo/shared";
import { default as request } from "@/utils/request/request";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const { login: loginWithToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const loginResponse = await Services.Auth.login(request, {
        email,
        password,
      });
      loginWithToken(loginResponse.accessToken, loginResponse.refreshToken);
      showToast(
        "success",
        t("login.message.successMessage") || "Login successful"
      );
      navigate("/");
    } catch (error: any) {
      showToast(
        "error",
        t("login.message.failedMessage") || "Login failed",
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
              <CardTitle>{t("login.title")}</CardTitle>
              <CardDescription>{t("login.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">
                      {t("common.form.label.email")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("login.input.placeHolder.email")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">
                        {t("common.form.label.password")}
                      </Label>
                      <a
                        href="/forgot-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        {t("login.forgotPassword.question")}
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading
                        ? t("common.form.button.loading") || "Loading..."
                        : t("common.form.button.login")}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t("login.dontHaveAnAccount")}{" "}
                  <a href="/register" className="underline underline-offset-4">
                    {t("common.form.button.signUp")}
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
