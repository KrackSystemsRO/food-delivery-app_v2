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
// import type { CategoryForm } from "@/types/category.type";
import { memo } from "react";
import { Types } from "@my-monorepo/shared";
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Category.CategoryForm;
  setForm: (form: Types.Category.CategoryForm) => void;
  isEditing: boolean;
}

type LabeledInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
};

const LabeledInput = memo(
  ({ label, value, onChange, type = "text" }: LabeledInputProps) => (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  )
);
LabeledInput.displayName = "LabeledInput";

export default memo(function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
}: CategoryModalProps) {
  const { t } = useTranslation();

  const updateForm = (field: keyof Types.Category.CategoryForm, value: any) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("category.editCategory")
              : t("category.createCategory")}
          </DialogTitle>
          <DialogDescription>
            {t("category.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <LabeledInput
            label={t("common.form.label.name")}
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />

          <LabeledInput
            label={t("common.form.label.description")}
            value={form.description || ""}
            onChange={(e) => updateForm("description", e.target.value)}
          />

          <div>
            <Label>{t("common.form.label.status")}</Label>
            <Select
              value={form.is_active ? "active" : "inactive"}
              onValueChange={(val: "active" | "inactive") =>
                updateForm("is_active", val === "active")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("common.form.label.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  {t("common.table.active")}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("common.table.inactive")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="space-x-2">
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
});
