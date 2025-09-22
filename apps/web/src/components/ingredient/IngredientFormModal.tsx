import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/common/FormModal";
import { Types } from "@my-monorepo/shared";

interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Ingredient.IngredientForm;
  setForm: React.Dispatch<
    React.SetStateAction<Types.Ingredient.IngredientForm>
  >;
  selectedIngredient: Types.Ingredient.IngredientType | null;
  loading?: boolean;
}

export function IngredientFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  selectedIngredient,
  loading,
}: IngredientFormModalProps) {
  const { t } = useTranslation();

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={
        selectedIngredient
          ? t("ingredient.title.edit") || "Edit Ingredient"
          : t("ingredient.title.create") || "Create Ingredient"
      }
      submitLabel={
        selectedIngredient
          ? t("common.button.update")
          : t("common.button.create")
      }
      cancelLabel={t("common.button.cancel")}
      loading={loading}
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder={t("common.form.label.name")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder={t("common.form.label.description")}
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>
    </FormModal>
  );
}
