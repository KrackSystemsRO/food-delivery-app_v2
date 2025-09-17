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
} from "@/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as SelectPrimitive from "@radix-ui/react-select";

interface UserForm {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: UserForm;
  setForm: (form: UserForm) => void;
  isEditing: boolean;
}

function UserModalComponent({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
}: UserModalProps) {
  const { t } = useTranslation();

  const roleOptions = useMemo(
    () => [
      { value: "ADMIN", label: t("role.admin") || "Admin" },
      {
        value: "MANAGER_RESTAURANT",
        label: t("role.managerRestaurant") || "Manager Restaurant",
      },
      { value: "CLIENT", label: t("role.client") || "Client" },
      { value: "COURIER", label: t("role.courier") || "Courier" },
    ],
    [t]
  );

  const handleChange = useCallback(
    (field: keyof UserForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
    },
    [form, setForm]
  );

  const handleRoleChange = useCallback(
    (value: string) => setForm({ ...form, role: value }),
    [form, setForm]
  );

  const roleLabel =
    roleOptions.find((r) => r.value === form.role)?.label ||
    t("common.form.select.role") ||
    "Select role";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("user.editUser") || "Edit User"
              : t("user.createUser") || "Create User"}
          </DialogTitle>
          <DialogDescription>
            {t("user.dialogDescription") || "Fill in the user details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t("common.form.label.firstName") || "First Name"}</Label>
            <Input
              value={form.first_name}
              onChange={handleChange("first_name")}
            />
          </div>
          <div>
            <Label>{t("common.form.label.lastName") || "Last Name"}</Label>
            <Input
              value={form.last_name}
              onChange={handleChange("last_name")}
            />
          </div>
          <div>
            <Label>{t("common.form.label.email") || "Email"}</Label>
            <Input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
            />
          </div>
          <div>
            <Label>{t("common.form.label.role") || "Role"}</Label>
            <Select value={form.role} onValueChange={handleRoleChange}>
              <SelectTrigger
                aria-label="Role"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex justify-between items-center"
              >
                <SelectValue>{roleLabel}</SelectValue>
                <SelectPrimitive.Icon asChild>
                  <ChevronDownIcon className="size-4 opacity-50" />
                </SelectPrimitive.Icon>
              </SelectTrigger>
              <SelectContent
                className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white p-1 shadow-lg"
                position="popper"
              >
                {roleOptions.map((role) => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-blue-100 data-[highlighted]:bg-blue-200 data-[highlighted]:text-blue-900 data-[state=checked]:font-semibold"
                  >
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.button.cancel") || "Cancel"}
          </Button>
          <Button onClick={onSubmit}>
            {isEditing
              ? t("common.button.update") || "Update"
              : t("common.button.create") || "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(UserModalComponent);
