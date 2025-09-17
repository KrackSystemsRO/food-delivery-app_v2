import { toast } from "sonner";

export const showToast = (
  type: "success" | "error" | "info",
  title: string,
  message?: string,
  position: "top" | "bottom" = "bottom"
) => {
  const mappedPosition = position === "top" ? "top-right" : "bottom-right";

  toast[type](message ? `${title} – ${message}` : title, {
    position: mappedPosition,
    duration: 3000,
  });
};
