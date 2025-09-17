import { useCallback, memo } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { useTranslation } from "react-i18next";

import type { CompanyType } from "@/types/company.type";
import type { UserType } from "@/types/user.type";
import type { StoreForm } from "@/types/store.type";

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: StoreForm;
  setForm: (form: StoreForm) => void;
  isEditing: boolean;
  companies: CompanyType[];
  users: UserType[];
}

const SelectItemMemo = memo(({ children, ...props }: any) => (
  <SelectItem {...props}>{children}</SelectItem>
));

export default function StoreModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  companies,
  users,
}: StoreModalProps) {
  const { t } = useTranslation();

  const toggleAdminUser = useCallback(
    (userId: string) => {
      const isSelected = form.admin.some((u) => u._id === userId);
      if (isSelected) {
        setForm({ ...form, admin: form.admin.filter((u) => u._id !== userId) });
      } else {
        const userToAdd = users.find((u) => u._id === userId);
        if (userToAdd) setForm({ ...form, admin: [...form.admin, userToAdd] });
      }
    },
    [form, setForm, users]
  );

  const toggleCompany = useCallback(
    (companyId: string) => {
      const isSelected = form.company.some((c) => c._id === companyId);
      if (isSelected) {
        setForm({
          ...form,
          company: form.company.filter((c) => c._id !== companyId),
        });
      } else {
        const companyToAdd = companies.find((c) => c._id === companyId);
        if (companyToAdd)
          setForm({ ...form, company: [...form.company, companyToAdd] });
      }
    },
    [form, setForm, companies]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("store.editStore") || "Edit Store"
              : t("store.createStore") || "Create Store"}
          </DialogTitle>
          <DialogDescription>
            {t("store.dialogDescription") || "Fill in the store details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="store-name">
              {t("common.form.label.name") || "Store Name"}
            </Label>
            <Input
              className="w-full"
              id="store-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="company">
              {t("common.form.label.company") || "Company"}
            </Label>
            <Select
              value={form.company.length > 0 ? form.company[0]._id : ""}
              onValueChange={toggleCompany}
            >
              <SelectTrigger
                id="company"
                aria-label="Company"
                className="w-full max-w-xs"
              >
                <SelectValue>
                  {form.company.length > 0
                    ? form.company.map((c) => c.name).join(", ")
                    : t("common.form.select.company") || "Select company"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto rounded-md p-1">
                {companies.map((company) => {
                  const isSelected = form.company.some(
                    (c) => c._id === company._id
                  );
                  return (
                    <SelectItemMemo
                      key={company._id}
                      value={company._id}
                      className={`px-3 py-2 text-sm ${
                        isSelected
                          ? "font-semibold bg-blue-200 text-blue-900"
                          : "text-gray-700"
                      }`}
                    >
                      {company.name}
                    </SelectItemMemo>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="admins">
              {t("common.form.label.admin") || "Admins"}
            </Label>
            <Select
              value={form.admin.length > 0 ? form.admin[0]._id : ""}
              onValueChange={toggleAdminUser}
            >
              <SelectTrigger
                id="admins"
                aria-label="Admins"
                className="w-full max-w-xs"
              >
                <SelectValue>
                  {form.admin.length > 0
                    ? form.admin
                        .map(
                          (u) => `${u.first_name} ${u.last_name} (${u.email})`
                        )
                        .join(", ")
                    : t("common.form.select.admins") || "Select admins"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-auto rounded-md p-1">
                {users.map((user) => {
                  const isSelected = form.admin.some((u) => u._id === user._id);
                  return (
                    <SelectItemMemo
                      key={user._id}
                      value={user._id}
                      className={`px-3 py-2 text-sm ${
                        isSelected
                          ? "font-semibold bg-blue-200 text-blue-900"
                          : "text-gray-700"
                      }`}
                    >
                      {user.first_name} {user.last_name} ({user.email})
                    </SelectItemMemo>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2 justify-end">
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
