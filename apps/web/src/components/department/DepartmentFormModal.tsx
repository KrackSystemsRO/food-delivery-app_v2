import { FormModal } from "@/components/common/form-modal";
import { LabeledInput } from "@/components/common/label-input";
import { CustomSelect } from "@/components/common/custom-select";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
  form: Types.Department.DepartmentForm;
  setForm: React.Dispatch<
    React.SetStateAction<Types.Department.DepartmentForm>
  >;
  usersList: Types.User.UserType[];
  companiesList: Types.Company.CompanyType[];
  selectedDepartment?: Types.Department.DepartmentType | null;
}

export function DepartmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  form,
  setForm,
  usersList,
  companiesList,
  selectedDepartment,
}: DepartmentFormModalProps) {
  const { t } = useTranslation();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={
        selectedDepartment
          ? t("department.editDepartment") || "Edit Department"
          : t("department.createDepartment") || "Create Department"
      }
      submitLabel={
        selectedDepartment
          ? t("common.button.update") || "Update"
          : t("common.button.create") || "Create"
      }
      cancelLabel={t("common.button.cancel")}
      loading={loading}
    >
      <LabeledInput
        label={t("common.form.label.name") || "Name"}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <LabeledInput
        label={t("common.form.label.description") || "Description"}
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <CustomSelect
        label={t("common.form.label.companies") || "Companies"}
        multiple
        value={form.company.map((c) => c._id).filter(Boolean) as string[]}
        onValueChange={(vals: string[]) =>
          setForm({
            ...form,
            company: companiesList.filter((c) => vals.includes(c._id)),
          })
        }
        options={companiesList.map((c) => ({ value: c._id, label: c.name }))}
      />
      <CustomSelect
        label={t("common.form.label.admins") || "Admins"}
        multiple
        value={form.admin.map((u) => u._id).filter(Boolean) as string[]}
        onValueChange={(vals: string[]) =>
          setForm({
            ...form,
            admin: usersList.filter((u) => vals.includes(u._id)),
          })
        }
        options={usersList.map((u) => ({ value: u._id, label: u.first_name }))}
      />
      <CustomSelect<"active" | "inactive">
        label={t("common.form.label.status") || "Status"}
        value={form.is_active ? "active" : "inactive"}
        onValueChange={(val) =>
          setForm({ ...form, is_active: val === "active" })
        }
        options={[
          { value: "active", label: t("common.active") || "Active" },
          { value: "inactive", label: t("common.inactive") || "Inactive" },
        ]}
      />
    </FormModal>
  );
}
