import { LabeledInput } from "@/components/common/label-input";
import { CustomSelect } from "@/components/common/custom-select";
import { Types } from "@my-monorepo/shared";

interface Props {
  form: Types.Allergen.AllergenForm;
  setForm: React.Dispatch<React.SetStateAction<Types.Allergen.AllergenForm>>;
  t: (key: string) => string;
}

export default function AllergenForm({ form, setForm, t }: Props) {
  return (
    <>
      <LabeledInput
        label={t("common.form.label.name")}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <LabeledInput
        label={t("common.form.label.description")}
        value={form.description || ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <CustomSelect<"active" | "inactive">
        label={t("common.form.label.status")}
        value={form.is_active ? "active" : "inactive"}
        onValueChange={(val) =>
          setForm({ ...form, is_active: val === "active" })
        }
        options={[
          { value: "active", label: t("common.table.active") },
          { value: "inactive", label: t("common.table.inactive") },
        ]}
      />
    </>
  );
}
