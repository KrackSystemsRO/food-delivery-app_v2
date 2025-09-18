import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Types } from "@my-monorepo/shared";
import { useTranslation } from "react-i18next";

type OrderModalProps = {
  order: Types.Order.OrderType | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderModal({
  order,
  isOpen,
  onClose,
}: OrderModalProps) {
  const { t } = useTranslation();
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t("order.viewOrder")} #{order.orderId}
          </DialogTitle>
          <DialogDescription>
            Status: <span className="capitalize">{order.status}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{t("order.client")}</h3>
              <p>
                {order.user.first_name} {order.user.last_name}
              </p>
              <p className="text-sm text-gray-500">{order.user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{t("store.store")}</h3>
              <p>{order.store.name}</p>
              <p className="text-sm text-gray-500">
                {order.store.is_open
                  ? t("common.form.select.open")
                  : t("common.form.select.closed")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">
                {t("common.form.label.items")}
              </h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex flex-col border-b pb-2 last:border-0"
                  >
                    <div className="flex justify-between">
                      <span>
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="text-gray-500">
                        {item.product.available
                          ? t("common.form.label.available")
                          : t("common.form.label.unavailable")}
                      </span>
                    </div>
                    {item.observations && (
                      <p className="text-sm text-gray-500">
                        {t("common.form.label.observations")}:{" "}
                        {item.observations}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">
                {t("common.form.label.deliveryLocation")}
              </h3>
              <p>{order.deliveryLocation.address}</p>
              <p className="text-sm text-gray-500">
                Lat: {order.deliveryLocation.lat}, Lng:{" "}
                {order.deliveryLocation.lng}
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4">
            <span className="font-semibold">Total: ${order.total}</span>
            <span className="text-sm text-gray-500">
              {t("common.table.createdAt")}:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
