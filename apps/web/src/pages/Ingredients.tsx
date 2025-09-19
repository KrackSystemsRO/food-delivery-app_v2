import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import useIngredientStore from "@/stores/ingredientStore";
import {
  IngredientFilters,
  type FiltersType,
} from "@/components/ingredient/IngredientFilters";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { IngredientFormModal } from "@/components/ingredient/IngredientFormModal";
import IngredientTable from "@/components/ingredient/IngredientTable";

const defaultFilters: FiltersType = {
  search: "",
  is_active: undefined,
  limit: 10,
};

export default function IngredientManagementPage() {
  const { t } = useTranslation();

  const [ingredientToDelete, setIngredientToDelete] =
    useState<Types.Ingredient.IngredientType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<Types.Ingredient.IngredientForm>({
    name: "",
    description: "",
    is_active: true,
  });

  const [filters, setFilters] = useState(defaultFilters);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Ingredient.IngredientType;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const {
    ingredientsList: ingredients,
    setIngredientsList,
    clearIngredientsList,
    selectedIngredient,
    setSelectedIngredient,
    clearSelectedIngredient,
    updateIngredientInList,
  } = useIngredientStore();

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Ingredient.getIngredients(axiosInstance, {
        search: filters.search,
        is_active: filters.is_active,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setIngredientsList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast(
        "error",
        t("ingredient.loadFailed") || "Failed to load ingredients"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setIngredientsList, t]);

  useEffect(() => {
    fetchIngredients();
    return () => clearIngredientsList();
  }, [fetchIngredients, clearIngredientsList]);

  useEffect(() => {
    localStorage.setItem("ingredientFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback(
    (key: keyof Types.Ingredient.IngredientType) =>
      setSortConfig((current) => ({
        key,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      })),
    []
  );

  const openCreateModal = useCallback(() => {
    clearSelectedIngredient();
    setForm({ name: "", description: "", is_active: true });
    setModalOpen(true);
  }, [clearSelectedIngredient]);

  const openEditModal = useCallback(
    (ingredient: Types.Ingredient.IngredientType) => {
      setSelectedIngredient(ingredient);
      setForm({
        name: ingredient.name,
        description: ingredient.description || "",
        is_active: ingredient.is_active,
      });
      setModalOpen(true);
    },
    [setSelectedIngredient]
  );

  const confirmDelete = useCallback(
    (ingredient: Types.Ingredient.IngredientType) => {
      setIngredientToDelete(ingredient);
      setDeleteModalOpen(true);
    },
    []
  );

  const performDelete = useCallback(async () => {
    if (!ingredientToDelete) return;
    try {
      await Services.Ingredient.deleteIngredient(
        axiosInstance,
        ingredientToDelete._id
      );
      fetchIngredients();
      showToast(
        "success",
        t("ingredient.message.deleted") || "Ingredient deleted"
      );
    } catch {
      showToast(
        "error",
        t("ingredient.message.deleteFailed") || "Failed to delete ingredient"
      );
    } finally {
      setDeleteModalOpen(false);
      setIngredientToDelete(null);
    }
  }, [ingredientToDelete, fetchIngredients, t]);

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("ingredient.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedIngredient) {
        const res = await Services.Ingredient.updateIngredient(
          axiosInstance,
          selectedIngredient._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("ingredient.message.updated"));
          updateIngredientInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Ingredient.addIngredient(
          axiosInstance,
          form
        );
        if (res.status === 201) {
          showToast("success", t("ingredient.message.created"));
          fetchIngredients();
        } else throw new Error();
      }
      setModalOpen(false);
      clearSelectedIngredient();
    } catch {
      showToast("error", t("ingredient.message.submitFailed"));
    }
  }, [
    form,
    selectedIngredient,
    fetchIngredients,
    updateIngredientInList,
    clearSelectedIngredient,
    t,
  ]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("ingredientFilters");
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("ingredient.title") || "Manage Ingredients"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("ingredient.createIngredient") || "Create Ingredient"}
        </Button>
      </div>

      <IngredientFilters
        filters={filters}
        setFilters={(updated) => {
          setFilters((prev) => ({ ...prev, ...updated }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />

      <IngredientTable
        ingredients={ingredients}
        loading={loading}
        page={page}
        totalPages={totalPages}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        onPageChange={setPage}
      />

      <IngredientFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        selectedIngredient={selectedIngredient}
        loading={loading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("ingredient.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("ingredient.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this ingredient? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
        loading={loading}
      />
    </div>
  );
}
