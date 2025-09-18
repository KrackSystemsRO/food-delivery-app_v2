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
import { useState } from "react";
import { showToast } from "@/utils/toast";
import { default as request } from "@/utils/request/request";
import { Services } from "@my-monorepo/shared";

export default function ForgotPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await Services.Auth.forgotPassword(request, email);
      showToast(
        "success",
        t("forgotPassword.message.success") || "Reset email sent"
      );
    } catch (error: any) {
      showToast(
        "error",
        t("forgotPassword.message.failed") || "Failed to send email",
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
              <CardTitle>
                {t("login.forgotPassword.title") || "Forgot Password"}
              </CardTitle>
              <CardDescription>
                {t("login.forgotPassword.description") ||
                  "Enter your email to receive reset instructions."}
              </CardDescription>
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
                      placeholder={t("common.form.label.email") || "Your email"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading
                      ? t("common.form.button.loading") || "Sending..."
                      : t("login.forgotPassword.button.send") ||
                        "Send Reset Link"}
                  </Button>
                </div>
              </form>
              <a
                href="/login"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                {t("login.forgotPassword.button.backToLogin")}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
