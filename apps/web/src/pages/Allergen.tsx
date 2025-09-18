import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus, Check, X } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import { DataTable, type ColumnDef } from "@/components/common/data-table";

import useAllergenStore from "@/stores/allergen.store";
import {
  AllergenFilters,
  type FiltersType,
} from "@/components/allergen/filters.allergen";
import usePersistedState from "@/hooks/use-persisted-state";
import { Types, Services } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { FormModal } from "@/components/common/form-modal";
import { LabeledInput } from "@/components/common/label-input";
import { CustomSelect } from "@/components/common/custom-select";

const defaultFilters: FiltersType = {
  search: "",
  is_active: undefined,
  limit: 10,
};

type SortKey = "name" | "createdAt" | "is_active";

export default function AllergenManagementPage() {
  const { t } = useTranslation();

  const [allergenToDelete, setAllergenToDelete] =
    useState<Types.Allergen.AllergenType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<Types.Allergen.AllergenForm>({
    name: "",
    description: "",
    is_active: true,
  });

  const [filters, setFilters] = usePersistedState<FiltersType>(
    "allergenFilters",
    defaultFilters
  );

  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const {
    allergensList: allergens,
    setAllergensList,
    clearAllergensList,
    selectedAllergen,
    setSelectedAllergen,
    clearSelectedAllergen,
    updateAllergenInList,
  } = useAllergenStore();

  const sortableKeys: SortKey[] = ["name", "createdAt", "is_active"];

  const fetchAllergens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Allergen.getAllergens(axiosInstance, {
        search: filters.search,
        is_active: filters.is_active,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setAllergensList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast(
        "error",
        t("allergen.loadFailed") || "Failed to load allergens"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setAllergensList, t]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortConfig]);

  useEffect(() => {
    fetchAllergens();
    return () => clearAllergensList();
  }, [fetchAllergens, clearAllergensList, page]);

  const handleSort = useCallback((key: keyof Types.Allergen.AllergenType) => {
    if (!sortableKeys.includes(key as SortKey)) return;
    setSortConfig((current) => ({
      key: key as SortKey,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedAllergen();
    setForm({ name: "", description: "", is_active: true });
    setModalOpen(true);
  }, [clearSelectedAllergen]);

  const openEditModal = useCallback(
    (allergen: Types.Allergen.AllergenType) => {
      setSelectedAllergen(allergen);
      setForm({
        name: allergen.name,
        description: allergen.description || "",
        is_active: allergen.is_active,
      });
      setModalOpen(true);
    },
    [setSelectedAllergen]
  );

  const confirmDelete = useCallback((allergen: Types.Allergen.AllergenType) => {
    setAllergenToDelete(allergen);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!allergenToDelete) return;
    setDeleteLoading(true);
    try {
      await Services.Allergen.deleteAllergen(
        axiosInstance,
        allergenToDelete._id
      );
      showToast("success", t("allergen.message.deleted") || "Allergen deleted");

      if (allergens.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchAllergens();
      }
    } catch {
      showToast(
        "error",
        t("allergen.message.deleteFailed") || "Failed to delete allergen"
      );
    } finally {
      setDeleteModalOpen(false);
      setAllergenToDelete(null);
      setDeleteLoading(false);
    }
  }, [allergenToDelete, fetchAllergens, t, allergens.length, page]);

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("allergen.message.allFieldsRequired"));
      return;
    }
    setSubmitLoading(true);
    try {
      if (selectedAllergen) {
        const res = await Services.Allergen.updateAllergen(
          axiosInstance,
          selectedAllergen._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("allergen.message.updated"));
          updateAllergenInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Allergen.addAllergen(axiosInstance, form);
        if (res.status === 201) {
          showToast("success", t("allergen.message.created"));
          fetchAllergens();
        } else throw new Error();
      }

      setModalOpen(false);
      clearSelectedAllergen();
    } catch {
      showToast("error", t("allergen.message.submitFailed"));
    } finally {
      setSubmitLoading(false);
    }
  }, [
    form,
    selectedAllergen,
    fetchAllergens,
    updateAllergenInList,
    clearSelectedAllergen,
    t,
  ]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("allergenFilters");
  }, [setFilters]);

  const columns: ColumnDef<Types.Allergen.AllergenType>[] = [
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
          {t("allergen.title") || "Manage Allergens"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("allergen.createAllergen") || "Create Allergen"}
        </Button>
      </div>

      <AllergenFilters
        filters={filters}
        setFilters={(updated: Partial<FiltersType>) =>
          setFilters((prev) => ({ ...prev, ...updated }))
        }
        resetFilters={resetFilters}
      />

      {/* ✅ Generic DataTable usage */}
      <DataTable
        columns={columns}
        data={allergens}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("common.table.noData") || "No allergens found."}
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
          selectedAllergen
            ? t("allergen.editAllergen")
            : t("allergen.createAllergen")
        }
        description={t("allergen.dialogDescription")}
        submitLabel={
          selectedAllergen
            ? t("common.button.update")
            : t("common.button.create")
        }
        loading={submitLoading}
      >
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
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        loading={deleteLoading}
        title={t("allergen.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("allergen.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this allergen? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}
