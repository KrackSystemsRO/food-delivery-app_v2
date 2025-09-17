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
import type { ProductForm } from "@/types/product.type";
import { Types } from "@my-monorepo/shared";
import MultiSelectWithChips from "./MultiSelectWithChips";
import { IngredientsSelector } from "./IngredientsSelector";
import StoreSelector from "./StoreSelector";
import type { StoreType } from "@/types/store.type";
import { getCategories } from "@/services/category.service";
import { memo, useCallback, useEffect, useMemo } from "react";
import useCategoryStore from "@/stores/category.store";
import { getIngredients } from "@/services/ingredient.service";
import useIngredientStore from "@/stores/ingredient.store";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  isEditing: boolean;
  storesList: StoreType[];
}

const LabeledInput = memo(
  ({
    label,
    value,
    onChange,
    type = "text",
  }: {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }) => (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={onChange} type={type} />
    </div>
  )
);

export function ProductModalComponent({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  isEditing,
  storesList,
}: ProductModalProps) {
  const { t } = useTranslation();
  const { categoriesList, setCategoriesList } = useCategoryStore();
  const { ingredientsList, setIngredientsList } = useIngredientStore();

  useEffect(() => {
    (async () => {
      const categories = await getCategories({ is_active: true });
      setCategoriesList(categories.result ?? []);
      const ingredient = await getIngredients({ is_active: true });
      setIngredientsList(ingredient.result ?? []);
    })();
  }, []);

  const handleCategorySearch = useCallback(
    async (input: string) => {
      if (!input) {
        return categoriesList.map((c) => ({ _id: c._id, name: c.name }));
      }

      const result = await getCategories({ is_active: true, search: input });
      return result.result.map((c) => ({ _id: c._id, name: c.name }));
    },
    [categoriesList]
  );

  const handleIngredientSearch = useCallback(
    async (input: string) => {
      if (!input) {
        return ingredientsList.map((c) => ({ _id: c._id, name: c.name }));
      }

      const result = await getIngredients({ is_active: true, search: input });
      return result.result.map((c) => ({ _id: c._id, name: c.name }));
    },
    [ingredientsList]
  );

  const categoryOptions = useMemo(
    () => categoriesList.map((c) => ({ _id: c._id, name: c.name })),
    [categoriesList]
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("product.editProduct") : t("product.createProduct")}
          </DialogTitle>
          <DialogDescription>
            {t("product.dialogDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
          <StoreSelector
            stores={storesList}
            value={form.store}
            onChange={(store) => setForm({ ...form, store })}
          />
          <LabeledInput
            label={t("common.form.label.price")}
            value={form.price}
            type="number"
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) })
            }
          />

          <div>
            <MultiSelectWithChips
              label={t("common.form.label.categories")}
              options={categoryOptions}
              selected={(form.category || []).map((c) => ({
                _id: c._id,
                name: c.name,
              }))}
              allowCreate={true}
              onInputChange={handleCategorySearch}
              onChange={(newCats) => {
                const mapped: Types.Category.CategoryType[] = newCats.map(
                  (c) => ({
                    _id: c._id,
                    name: c.name,
                  })
                );
                setForm({ ...form, category: mapped });
              }}
            />
          </div>

          <div>
            <IngredientsSelector
              options={ingredientsList}
              value={(form.ingredients || []).map((i) => ({
                ingredient: ingredientsList.find(
                  (x) => x._id === i.ingredient._id
                )!,
                quantity: i.quantity,
                unit: i.unit || "gram",
              }))}
              onChange={(ings) =>
                setForm({
                  ...form,
                  ingredients: ings.map((i) => ({
                    ingredient: i.ingredient,
                    quantity: i.quantity,
                    unit: i.unit,
                  })),
                })
              }
              onInputChange={handleIngredientSearch}
            />
          </div>

          <div>
            <Label>{t("common.form.label.status")}</Label>
            <select
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.is_active ? "active" : "inactive"}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.value === "active" })
              }
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

export const ProductModal = memo(ProductModalComponent);
