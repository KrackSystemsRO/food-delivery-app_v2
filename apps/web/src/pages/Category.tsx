import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus, Check, X } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import useCategoryStore from "@/stores/category.store";
import { CategoryFilters } from "@/components/category/filters.category";
import { FormModal } from "@/components/common/form-modal";
import { LabeledInput } from "@/components/common/label-input";
import { CustomSelect } from "@/components/common/custom-select";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

const defaultFilters = {
  search: "",
  is_active: undefined,
  limit: 10,
};

export default function CategoryManagementPage() {
  const { t } = useTranslation();

  const [categoryToDelete, setCategoryToDelete] =
    useState<Types.Category.CategoryType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<Types.Category.CategoryForm>({
    name: "",
    description: "",
    is_active: true,
  });

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("categoryFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          search: parsed.search || "",
          is_active:
            parsed.is_active === undefined ? undefined : parsed.is_active,
          limit: parsed.limit ? Number(parsed.limit) : 10,
        };
      } catch {
        return defaultFilters;
      }
    }
    return defaultFilters;
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Category.CategoryType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

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

  useEffect(() => {
    localStorage.setItem("categoryFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback((key: keyof Types.Category.CategoryType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedCategory();
    setForm({
      name: "",
      description: "",
      is_active: true,
    });
    setModalOpen(true);
  }, [clearSelectedCategory]);

  const openEditModal = useCallback(
    (category: Types.Category.CategoryType) => {
      setSelectedCategory(category);
      setForm({
        name: category.name,
        description: category.description || "",
        is_active: category.is_active,
      });
      setModalOpen(true);
    },
    [setSelectedCategory]
  );

  const confirmDelete = useCallback((category: Types.Category.CategoryType) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
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
  }, [categoryToDelete, fetchCategories, t]);

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("category.message.allFieldsRequired"));
      return;
    }

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
    }
  }, [
    form,
    selectedCategory,
    fetchCategories,
    updateCategoryInList,
    clearSelectedCategory,
    t,
  ]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("categoryFilters");
  }, []);

  const columns: ColumnDef<Types.Category.CategoryType>[] = [
    { key: "name", label: t("common.table.name") },
    { key: "description", label: t("common.table.description") },
    {
      key: "is_active",
      label: t("common.table.is_active"),
      render: (row) =>
        row.is_active ? (
          <Check className="text-green-500 inline-block" />
        ) : (
          <X className="text-red-500 inline-block" />
        ),
    },
  ];

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
        setFilters={(updated: Partial<typeof filters>) => {
          setFilters((prev) => ({ ...prev, ...updated }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />

      <DataTable
        columns={columns}
        data={categories}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("common.table.noData") || "No categories found."}
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
            ? t("category.editCategory") || "Edit Category"
            : t("category.createCategory") || "Create Category"
        }
        description={t("category.dialogDescription")}
        submitLabel={
          selectedCategory
            ? t("common.button.update") || "Update"
            : t("common.button.create") || "Create"
        }
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

        <CustomSelect<"active" | "inactive">
          label={t("common.form.label.status") || "Status"}
          value={form.is_active ? "active" : "inactive"}
          onValueChange={(val) =>
            setForm({ ...form, is_active: val === "active" })
          }
          options={[
            { value: "active", label: t("common.table.active") || "Active" },
            {
              value: "inactive",
              label: t("common.table.inactive") || "Inactive",
            },
          ]}
        />
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
