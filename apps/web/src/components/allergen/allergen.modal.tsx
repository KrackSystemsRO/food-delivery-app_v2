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
interface AllergenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Allergen.AllergenForm;
  setForm: (form: Types.Allergen.AllergenForm) => void;
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
  value: string;
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

function AllergenModalComponent({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  loading,
}: AllergenModalProps) {
  const { t } = useTranslation();

  const statusOptions = useMemo(
    () => [
      { value: true, label: t("common.table.active") },
      { value: false, label: t("common.table.inactive") },
    ],
    [t]
  );

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, name: e.target.value }),
    [form, setForm]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, description: e.target.value }),
    [form, setForm]
  );

  const handleStatusChange = useCallback(
    (val: string) => setForm({ ...form, is_active: val === "active" }),
    [form, setForm]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("allergen.editAllergen")
              : t("allergen.createAllergen")}
          </DialogTitle>
          <DialogDescription>
            {t("allergen.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <LabeledInput
            label={t("common.form.label.name")}
            value={form.name}
            onChange={handleNameChange}
          />

          <LabeledInput
            label={t("common.form.label.description")}
            value={form.description || ""}
            onChange={handleDescriptionChange}
          />

          {/* Status Select */}
          <div>
            <Label>{t("common.form.label.status")}</Label>
            <Select
              value={form.is_active ? "active" : "inactive"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.form.label.status")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem
                    key={opt.value.toString()}
                    value={opt.value ? "active" : "inactive"}
                  >
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
              ? "Saving..."
              : isEditing
              ? t("common.button.update")
              : t("common.button.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AllergenModalComponent);
