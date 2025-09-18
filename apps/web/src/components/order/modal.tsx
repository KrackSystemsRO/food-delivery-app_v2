import React, { memo, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Button,
  DialogDescription,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Order.OrderForm;
  setForm: (form: Types.Order.OrderForm) => void;
  isEditing: boolean;
  loading?: boolean;
}

const LabeledInput = memo(function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  );
});

function OrderModalComponent({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  loading,
}: OrderModalProps) {
  const { t } = useTranslation();

  const statusOptions = useMemo(
    () => [
      { value: "pending", label: t("order.status.pending") },
      { value: "preparing", label: t("order.status.preparing") },
      { value: "on_the_way", label: t("order.status.on_the_way") },
      { value: "delivered", label: t("order.status.delivered") },
      { value: "cancelled", label: t("order.status.cancelled") },
    ],
    [t]
  );

  const handleUserChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, user: e.target.value }),
    [form, setForm]
  );

  const handleStoreChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, store: e.target.value }),
    [form, setForm]
  );

  const handleTotalChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, total: Number(e.target.value) }),
    [form, setForm]
  );

  const handleStatusChange = useCallback(
    (val: string) =>
      setForm({ ...form, status: val as Types.Order.OrderForm["status"] }),
    [form, setForm]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("order.edit") || "Edit Order"
              : t("order.create") || "Create Order"}
          </DialogTitle>
          <DialogDescription>
            {t("order.dialogDescription") || "Fill in the order details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <LabeledInput
            label={t("common.form.label.user") || "User ID"}
            value={form.user}
            onChange={handleUserChange}
          />

          <LabeledInput
            label={t("common.form.label.store") || "Store ID"}
            value={form.store}
            onChange={handleStoreChange}
          />

          <LabeledInput
            label={t("common.form.label.total") || "Total Amount"}
            value={form.total ?? ""}
            type="number"
            onChange={handleTotalChange}
          />

          {/* Status Select */}
          <div>
            <Label>{t("common.form.label.status")}</Label>
            <Select
              value={form.status || "pending"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.form.label.status")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.button.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading
              ? t("common.button.saving") || "Saving..."
              : isEditing
              ? t("common.button.update")
              : t("common.button.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(OrderModalComponent);
