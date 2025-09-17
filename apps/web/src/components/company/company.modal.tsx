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
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useMemo } from "react";
import type { CompanyForm } from "@/types/company.type";
import type { UserType } from "@/types/user.type";

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: CompanyForm;
  setForm: (form: CompanyForm) => void;
  isEditing: boolean;
  users: UserType[];
}

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const LabeledInput = memo(
  ({ label, value, onChange, type = "text" }: LabeledInputProps) => (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  )
);

interface CustomSelectProps<T = string> {
  label: string;
  value: T;
  onValueChange: (val: T) => void;
  options: { value: T; label: string }[];
}

const CustomSelect = memo(
  <T extends string>({
    label,
    value,
    onValueChange,
    options,
  }: CustomSelectProps<T>) => {
    const selectedOption = options.find((opt) => opt.value === value);
    return (
      <div>
        <Label>{label}</Label>
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex justify-between items-center">
            <SelectValue>{selectedOption?.label || label}</SelectValue>
            <SelectPrimitive.Icon asChild>
              <ChevronDownIcon className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectTrigger>
          <SelectContent
            className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white p-1 shadow-lg"
            position="popper"
          >
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 data-[highlighted]:bg-blue-200 data-[highlighted]:text-blue-900 data-[state=checked]:font-semibold"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);

export default function CompanyModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  users,
}: CompanyModalProps) {
  const { t } = useTranslation();

  const toggleAdminUser = useCallback(
    (userId: string) => {
      const isSelected = form.admin.some((u) => u._id === userId);
      const updatedAdmins = isSelected
        ? form.admin.filter((u) => u._id !== userId)
        : [...form.admin, users.find((u) => u._id === userId)!];
      setForm({ ...form, admin: updatedAdmins });
    },
    [form, setForm, users]
  );

  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: u._id,
        label: `${u.first_name} ${u.last_name} (${u.email})`,
      })),
    [users]
  );

  const typeOptions = useMemo(
    () => [
      { value: "PROVIDER", label: t("company.type.provider") },
      { value: "CLIENT", label: t("company.type.client") },
    ],
    [t]
  );

  const statusOptions = useMemo(
    () => [
      { value: "active", label: t("common.table.active") },
      { value: "inactive", label: t("common.table.inactive") },
    ],
    [t]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("company.editCompany") : t("company.createCompany")}
          </DialogTitle>
          <DialogDescription>
            {t("company.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <LabeledInput
            label={t("common.form.label.name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <CustomSelect
            label={t("common.form.label.admin")}
            value={form.admin[0]?._id || ""}
            onValueChange={toggleAdminUser}
            options={userOptions}
          />
          <LabeledInput
            label={t("common.form.label.email")}
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
          />
          <LabeledInput
            label={t("common.form.label.address")}
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <LabeledInput
            label={t("common.form.label.phone")}
            value={form.phone_number || ""}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
            type="tel"
          />
          <CustomSelect
            label={t("common.form.label.type")}
            value={form.type || ""}
            onValueChange={(val) =>
              (val === "PROVIDER" || val === "CLIENT") &&
              setForm({ ...form, type: val })
            }
            options={typeOptions}
          />
          <CustomSelect
            label={t("common.form.label.status")}
            value={form.is_active ? "active" : "inactive"}
            onValueChange={(val) =>
              setForm({ ...form, is_active: val === "active" })
            }
            options={statusOptions}
          />
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
