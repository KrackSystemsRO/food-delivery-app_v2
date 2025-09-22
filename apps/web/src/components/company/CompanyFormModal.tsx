import { FormModal } from "@/components/common/FormModal";
import { LabeledInput } from "@/components/common/LabelInput";
import { CustomSelect } from "@/components/common/CustomSelect";
import { Types } from "@my-monorepo/shared";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  loading?: boolean;
  form: Types.Company.CompanyForm;
  setForm: (form: Types.Company.CompanyForm) => void;
  selectedCompany?: Types.Company.CompanyType | null;
}

export function CompanyFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  form,
  setForm,
  selectedCompany,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={
        selectedCompany
          ? t("company.editCompany") || "Edit Company"
          : t("company.createCompany") || "Create Company"
      }
      submitLabel={
        selectedCompany
          ? t("common.button.update") || "Update"
          : t("common.button.create") || "Create"
      }
      cancelLabel={t("common.button.cancel") || "Cancel"}
      loading={loading}
    >
      <LabeledInput
        label={t("common.form.label.name") || "Name"}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <LabeledInput
        label={t("common.form.label.email") || "Email"}
        value={form.email || ""}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <LabeledInput
        label={t("common.form.label.phone") || "Phone"}
        value={form.phone_number || ""}
        onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
      />
      <LabeledInput
        label={t("common.form.label.address") || "Address"}
        value={form.address || ""}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <CustomSelect
        label={t("common.form.label.type") || "Type"}
        value={form.type ?? ""}
        onValueChange={(val) =>
          setForm({
            ...form,
            type: val ? (val as "PROVIDER" | "CLIENT") : undefined,
          })
        }
        options={[
          {
            value: "PROVIDER",
            label: t("company.type.provider") || "Provider",
          },
          { value: "CLIENT", label: t("company.type.client") || "Client" },
        ]}
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
