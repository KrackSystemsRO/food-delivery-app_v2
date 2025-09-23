import { useState, useEffect, useCallback } from "react";
import { FormModal } from "@/components/common/FormModal";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { Types, Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

interface OrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Types.Order.OrderType | null;
  refreshList: () => void;
}

export default function OrderFormModal({
  isOpen,
  onClose,
  selectedOrder,
  refreshList,
}: OrderFormModalProps) {
  const { t } = useTranslation();

  const [form, setForm] = useState<{
    user: Types.User.UserType;
    status: Types.Order.OrderStatus["status"];
  }>({
    user: selectedOrder?.user || "",
    status: selectedOrder?.status || "pending",
  });

  useEffect(() => {
    setForm({
      user: selectedOrder?.user || "",
      status: selectedOrder?.status || "pending",
    });
  }, [selectedOrder]);

  const handleSubmit = useCallback(async () => {
    if (!selectedOrder) return;

    const payload: Types.Order.OrderForm = {
      store: selectedOrder.store,
      items: selectedOrder.items.filter(
        (item): item is NonNullable<typeof item> => !!item
      ),
      total: selectedOrder.total,
      deliveryLocation: selectedOrder.deliveryLocation,
      user: form.user,
      status: form.status,
    };

    try {
      if (selectedOrder) {
        await Services.Order.updateOrder(
          axiosInstance,
          selectedOrder._id,
          payload
        );
        showToast("success", t("order.message.updated") || "Order updated");
      } else {
        await Services.Order.addOrder(axiosInstance, payload);
        showToast("success", t("order.message.created") || "Order created");
      }
      refreshList();
      onClose();
    } catch {
      showToast(
        "error",
        t("order.message.submitFailed") || "Failed to save order"
      );
    }
  }, [form, selectedOrder, refreshList, onClose, t]);

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={
        selectedOrder
          ? t("order.editTitle") || "Edit Order"
          : t("order.createTitle") || "Create Order"
      }
      submitLabel={
        selectedOrder
          ? t("common.button.update") || "Update"
          : t("common.button.save") || "Save"
      }
      cancelLabel={t("common.button.cancel") || "Cancel"}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("order.form.user") || "User"}
          </label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={form.user}
            onChange={(e) => setForm({ ...form, user: e.target.value })}
            disabled={!!selectedOrder}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("order.form.status") || "Status"}
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as Types.Order.OrderStatus,
              })
            }
          >
            <option value="pending">
              {t("order.status.pending") || "Pending"}
            </option>
            <option value="confirmed">
              {t("order.status.completed") || "Completed"}
            </option>
            <option value="preparing">
              {t("order.status.canceled") || "Canceled"}
            </option>
            <option value="delivering">
              {t("order.status.canceled") || "Canceled"}
            </option>
            <option value="delivered">
              {t("order.status.canceled") || "Canceled"}
            </option>
            <option value="cancelled">
              {t("order.status.canceled") || "Canceled"}
            </option>
          </select>
        </div>
      </div>
    </FormModal>
  );
}
