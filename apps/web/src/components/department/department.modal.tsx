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
import { Textarea } from "../ui/textarea";
import { useMemo, useCallback } from "react";
import { Types } from "@my-monorepo/shared";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Department.DepartmentForm;
  setForm: (form: Types.Department.DepartmentForm) => void;
  isEditing: boolean;
  users: Types.User.UserType[];
  companies: Types.Company.CompanyType[];
}

interface CustomSelectProps<T> {
  value: string;
  options: { _id: string; label: string; original: T }[];
  placeholder: string;
  onSelect: (id: string) => void;
  renderLabel?: (item: T) => string;
}

function CustomSelect<T>({
  value,
  options,
  placeholder,
  onSelect,
  renderLabel,
}: CustomSelectProps<T>) {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm text-left flex justify-between items-center">
        <SelectValue>
          {value ? options.find((o) => o._id === value)?.label : placeholder}
        </SelectValue>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectTrigger>
      <SelectContent
        className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white p-1 shadow-lg"
        position="popper"
      >
        {options.map((option) => (
          <SelectItem
            key={option._id}
            value={option._id}
            className={`relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm hover:bg-blue-100 ${
              value === option._id
                ? "font-semibold bg-blue-200 text-blue-900"
                : ""
            }`}
          >
            {renderLabel ? renderLabel(option.original) : option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  users,
  companies,
}: DepartmentModalProps) {
  const { t } = useTranslation();

  const companyOptions = useMemo(
    () => companies.map((c) => ({ _id: c._id, label: c.name, original: c })),
    [companies]
  );

  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        _id: u._id,
        label: `${u.first_name} ${u.last_name} (${u.email})`,
        original: u,
      })),
    [users]
  );

  const selectCompany = useCallback(
    (id: string) => {
      const company = companies.find((c) => c._id === id);
      if (company) setForm({ ...form, company: [company] });
    },
    [companies, form, setForm]
  );

  const selectAdmin = useCallback(
    (id: string) => {
      const user = users.find((u) => u._id === id);
      if (user) setForm({ ...form, admin: [user] });
    },
    [users, form, setForm]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("department.editDepartment") ?? "Edit Department"
              : t("department.createDepartment") ?? "Create Department"}
          </DialogTitle>
          <DialogDescription>
            {t("department.dialogDescription") ??
              "Fill in the department details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>{t("common.form.label.name") ?? "Department Name"}</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <Label>{t("common.form.label.description") ?? "Description"}</Label>
            <Textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <Label>{t("common.form.label.company") ?? "Companies"}</Label>
            <CustomSelect
              value={form.company[0]?._id ?? ""}
              options={companyOptions}
              placeholder={
                t("common.form.select.companies") ?? "Select companies"
              }
              onSelect={selectCompany}
            />
          </div>

          <div>
            <Label>{t("common.form.label.admin") ?? "Admins"}</Label>
            <CustomSelect
              value={form.admin[0]?._id ?? ""}
              options={userOptions}
              placeholder={t("common.form.select.admins") ?? "Select admins"}
              onSelect={selectAdmin}
            />
          </div>

          <div>
            <Label>{t("common.form.label.status") ?? "Status"}</Label>
            <Select
              value={form.is_active ? "active" : "inactive"}
              onValueChange={(val) =>
                setForm({ ...form, is_active: val === "active" })
              }
            >
              <SelectTrigger className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm text-left flex justify-between items-center">
                <SelectValue>
                  {form.is_active
                    ? t("common.table.active") ?? "Active"
                    : t("common.table.inactive") ?? "Inactive"}
                </SelectValue>
                <ChevronDownIcon className="size-4 opacity-50" />
              </SelectTrigger>
              <SelectContent
                className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white p-1 shadow-lg"
                position="popper"
              >
                <SelectItem value="active">
                  {t("common.table.active") ?? "Active"}
                </SelectItem>
                <SelectItem value="inactive">
                  {t("common.table.inactive") ?? "Inactive"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.button.cancel") ?? "Cancel"}
          </Button>
          <Button onClick={onSubmit}>
            {isEditing
              ? t("common.button.update") ?? "Update"
              : t("common.button.create") ?? "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
