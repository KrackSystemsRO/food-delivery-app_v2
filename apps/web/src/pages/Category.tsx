import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { FormModal } from "@/components/common/form-modal";
import useCategoryStore from "@/stores/category.store";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { PaginationControls } from "@/components/common/pagination.common";
import CategoryFilters from "@/components/category/CategoryFilters";
import CategoryTable from "@/components/category/CategoryTable";
import CategoryForm from "@/components/category/CategoryForm";
import { ConfirmModal } from "@/components/common/confirm.modal";
import type { FiltersType } from "@/components/category/CategoryFilters";

const defaultFilters = { search: "", is_active: false, limit: 10 };

export default function CategoryManagementPage() {
  const { t } = useTranslation();
  const [categoryToDelete, setCategoryToDelete] =
    useState<Types.Category.CategoryType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<Types.Category.CategoryForm>({
    name: "",
    description: "",
    is_active: true,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Category.CategoryType;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  const {
    categoriesList: categories,
    setCategoriesList,
    clearCategoriesList,
    selectedCategory,
    setSelectedCategory,
    clearSelectedCategory,
    updateCategoryInList,
  } = useCategoryStore();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Category.getCategories(axiosInstance, {
        search: filters.search,
        is_active: filters.is_active,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setCategoriesList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast(
        "error",
        t("category.loadFailed") || "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setCategoriesList, t]);

  useEffect(() => {
    fetchCategories();
    return () => clearCategoriesList();
  }, [fetchCategories, clearCategoriesList]);

  const handleSort = (key: keyof Types.Category.CategoryType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const openCreateModal = () => {
    clearSelectedCategory();
    setForm({ name: "", description: "", is_active: true });
    setModalOpen(true);
  };
  const openEditModal = (category: Types.Category.CategoryType) => {
    setSelectedCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      is_active: category.is_active,
    });
    setModalOpen(true);
  };
  const confirmDelete = (category: Types.Category.CategoryType) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const performDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await Services.Category.deleteCategory(
        axiosInstance,
        categoryToDelete._id
      );
      fetchCategories();
      showToast("success", t("category.message.deleted") || "Category deleted");
    } catch {
      showToast(
        "error",
        t("category.message.deleteFailed") || "Failed to delete category"
      );
    } finally {
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.name) {
      showToast("error", t("category.message.allFieldsRequired"));
      return;
    }
    setSubmitLoading(true);
    try {
      if (selectedCategory) {
        const res = await Services.Category.updateCategory(
          axiosInstance,
          selectedCategory._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("category.message.updated"));
          updateCategoryInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Category.addCategory(axiosInstance, form);
        if (res.status === 201) {
          showToast("success", t("category.message.created"));
          fetchCategories();
        } else throw new Error();
      }
      setModalOpen(false);
      clearSelectedCategory();
    } catch {
      showToast("error", t("category.message.submitFailed"));
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("categoryFilters");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("category.title") || "Manage Categories"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("category.createCategory") || "Create Category"}
        </Button>
      </div>

      <CategoryFilters
        filters={filters}
        setFilters={(updated: Partial<FiltersType>) => {
          setFilters((prev) => ({ ...prev, ...updated }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />
      <CategoryTable
        data={categories}
        loading={loading}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        t={t}
      />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        title={
          selectedCategory
            ? t("category.editCategory")
            : t("category.createCategory")
        }
        description={t("category.dialogDescription")}
        submitLabel={
          selectedCategory
            ? t("common.button.update")
            : t("common.button.create")
        }
        loading={submitLoading}
      >
        <CategoryForm form={form} setForm={setForm} t={t} />
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("category.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("category.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this category? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}
