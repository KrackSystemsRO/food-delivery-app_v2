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
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useMemo } from "react";
import type { IngredientForm } from "@/types/ingredient.type";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: IngredientForm;
  setForm: (form: IngredientForm) => void;
  isEditing: boolean;
}

const LabeledInput = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }) => (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  )
);

export default function IngredientModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
}: IngredientModalProps) {
  const { t } = useTranslation();

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, name: e.target.value });
    },
    [form, setForm]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, description: e.target.value });
    },
    [form, setForm]
  );

  const handleAllergensChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({
        ...form,
        allergens: e.target.value.split(",").map((a) => a.trim()),
      });
    },
    [form, setForm]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setForm({ ...form, is_active: e.target.value === "active" });
    },
    [form, setForm]
  );

  const allergensText = useMemo(
    () => (form.allergens ? form.allergens.join(", ") : ""),
    [form.allergens]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("ingredient.editIngredient")
              : t("ingredient.createIngredient")}
          </DialogTitle>
          <DialogDescription>
            {t("ingredient.dialogDescription")}
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

          {form.allergens !== undefined && (
            <LabeledInput
              label={t("ingredient.form.label.allergens")}
              value={allergensText}
              onChange={handleAllergensChange}
            />
          )}

          <div>
            <Label>{t("common.form.label.status")}</Label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.is_active ? "active" : "inactive"}
              onChange={handleStatusChange}
            >
              <option value="active">{t("common.table.active")}</option>
              <option value="inactive">{t("common.table.inactive")}</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.button.cancel")}
          </Button>
          <Button onClick={onSubmit}>
            {isEditing ? t("common.button.update") : t("common.button.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
