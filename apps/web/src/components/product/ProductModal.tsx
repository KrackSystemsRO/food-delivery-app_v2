import { memo, useMemo, useCallback, useEffect } from "react";
import { FormModal } from "@/components/common/form-modal";
import { Label } from "@/components/ui";
import MultiSelectWithChips from "./MultiSelectWithChips";
import { IngredientsSelector } from "./IngredientsSelector";
import StoreSelector from "./StoreSelector";
import { Services, Types } from "@my-monorepo/shared";
import useCategoryStore from "@/stores/category.store";
import useIngredientStore from "@/stores/ingredient.store";
import axiosInstance from "@/utils/request/authorizedRequest";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  form: Types.Product.ProductForm;
  setForm: React.Dispatch<React.SetStateAction<Types.Product.ProductForm>>;
  selectedProduct?: Types.Product.ProductType | null;
  t: (key: string) => string;
  storesList: Types.Store.StoreType[];
}

export const ProductModal = memo(function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  selectedProduct,
  t,
  storesList,
}: ProductModalProps) {
  const { categoriesList, setCategoriesList } = useCategoryStore();
  const { ingredientsList, setIngredientsList } = useIngredientStore();

  useEffect(() => {
    (async () => {
      const categories = await Services.Category.getCategories(axiosInstance, {
        is_active: true,
      });
      setCategoriesList(categories.result ?? []);

      const ingredients = await Services.Ingredient.getIngredients(
        axiosInstance,
        { is_active: true }
      );
      setIngredientsList(ingredients.result ?? []);
    })();
  }, [setCategoriesList, setIngredientsList]);

  const categoryOptions = useMemo(
    () => categoriesList.map((c) => ({ _id: c._id, name: c.name })),
    [categoriesList]
  );

  const handleCategoryChange = useCallback(
    (newCats: { _id: string; name: string }[]) => {
      setForm((prev) => ({
        ...prev,
        category: newCats.map(
          (c) =>
            categoriesList.find((cat) => cat._id === c._id) ||
            ({} as Types.Category.CategoryType)
        ),
      }));
    },
    [setForm, categoriesList]
  );

  const handleIngredientChange = useCallback(
    (ings: Types.Ingredient.IngredientWithQuantity[]) => {
      setForm((prev) => ({
        ...prev,
        ingredients: ings.map((i) => ({
          ingredient: i.ingredient,
          quantity: i.quantity || "0",
          unit: i.unit,
        })),
      }));
    },
    [setForm]
  );

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={
        selectedProduct
          ? t("product.editTitle") || "Edit Product"
          : t("product.createTitle") || "Create Product"
      }
      description={
        selectedProduct
          ? t("product.editDesc") || "Update product details."
          : t("product.createDesc") ||
            "Fill in the details to create a new product."
      }
      submitLabel={
        selectedProduct
          ? t("common.button.update") || "Update"
          : t("common.button.save") || "Save"
      }
      cancelLabel={t("common.button.cancel") || "Cancel"}
    >
      <div className="space-y-4">
        {/* Name */}
        <div>
          <Label>{t("common.form.label.name")}</Label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <Label>{t("common.form.label.description")}</Label>
          <textarea
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Store */}
        <StoreSelector
          stores={storesList}
          value={form.store}
          onChange={(store) => setForm({ ...form, store })}
        />

        {/* Price */}
        <div>
          <Label>{t("common.form.label.price")}</Label>
          <input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Categories */}
        <MultiSelectWithChips
          label={t("common.form.label.categories")}
          options={categoryOptions}
          selected={(form.category || []).map((c) => ({
            _id: c._id,
            name: c.name,
          }))}
          allowCreate={true}
          onChange={handleCategoryChange}
        />

        {/* Ingredients */}
        <IngredientsSelector
          options={ingredientsList}
          value={(form.ingredients || []).map((i) => ({
            ingredient: i.ingredient,
            quantity: i.quantity,
            unit: i.unit || "gram",
          }))}
          onChange={handleIngredientChange}
        />

        {/* Active/Inactive */}
        <div>
          <Label>{t("common.form.label.status")}</Label>
          <select
            className="w-full rounded-md border px-3 py-2"
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
    </FormModal>
  );
});
