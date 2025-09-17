import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

import { ConfirmModal } from "@/components/user/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";

import type { StoreForm, StoreType } from "@/types/store.type";

import {
  addStore,
  deleteStore,
  getStores,
  updateStore,
} from "@/services/store.service";

import { StoreTable } from "@/components/store/data-table.store";
import useUserStore from "@/stores/user.store";
import { getUsers } from "@/services/user.service";
import useCompanyStore from "@/stores/company.store";
import { getCompanies } from "@/services/company.service";
import useStore from "@/stores/store.store";
import { StoreFilters } from "@/components/store/filters.store";
import StoreModal from "@/components/store/store.modal";
import { useDebounce } from "use-debounce";

const defaultFilters = {
  search: "",
  company: "",
  admin: "",
  type: "",
  is_active: undefined as boolean | undefined,
  is_open: undefined as boolean | undefined,
  limit: 10,
};

const storeTypes = ["RESTAURANT", "GROCERY", "BAKERY", "CAFE", "OTHER"];

export default function StoreManagementPage() {
  const { t } = useTranslation();

  const {
    storesList: stores,
    setStoresList,
    clearSelectedStore,
    selectedStore,
    setSelectedStore,
    updateStoreInList,
  } = useStore();
  const { usersList, setUsersList } = useUserStore();
  const { companiesList, setCompaniesList } = useCompanyStore();

  const [itemToDelete, setItemToDelete] = useState<StoreType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<StoreForm>({
    name: "",
    type: "RESTAURANT",
    address: "",
    phone_number: "",
    description: "",
    is_active: false,
    is_open: false,
    admin: [],
    company: [],
    location: { lat: undefined, lng: undefined },
  });
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("storeFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          search: parsed.search || "",
          company: parsed.company || "",
          admin: parsed.admin || "",
          type: parsed.type || "",
          is_active: parsed.is_active ?? undefined,
          is_open: parsed.is_open ?? undefined,
          limit: parsed.limit ? Number(parsed.limit) : 10,
        };
      } catch {
        return defaultFilters;
      }
    }
    return defaultFilters;
  });
  const [debouncedFilters] = useDebounce(filters, 10);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof StoreType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getStores({
        search: filters.search,
        company: filters.company,
        admin: filters.admin,
        type: filters.type,
        is_active: filters.is_active,
        is_open: filters.is_open,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setStoresList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("store.loadFailed") || "Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setStoresList, t]);

  useEffect(() => {
    (async () => {
      const usersRes = await getUsers({ is_active: true });
      setUsersList(usersRes.result);
      const companyRes = await getCompanies({ is_active: true });
      setCompaniesList(companyRes.result);
    })();
  }, [setUsersList, setCompaniesList]);

  useEffect(() => {
    fetchStores();
  }, [debouncedFilters, page, sortConfig]);

  useEffect(() => {
    localStorage.setItem("storeFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback((key: keyof StoreType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleFilterChange = useCallback((updated: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("store.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedStore) {
        const res = await updateStore(selectedStore._id, form);
        if (res.status === 200) {
          showToast("success", t("store.message.updated"));
          updateStoreInList(res.result);
        } else throw new Error();
      } else {
        const res = await addStore(form);
        if (res.status === 201) {
          showToast("success", t("store.message.created"));
          fetchStores();
        } else throw new Error();
      }
      setModalOpen(false);
      clearSelectedStore();
    } catch {
      showToast("error", t("store.message.submitFailed"));
    }
  }, [
    form,
    selectedStore,
    fetchStores,
    updateStoreInList,
    t,
    clearSelectedStore,
  ]);

  const openCreateModal = useCallback(() => {
    clearSelectedStore();
    setForm({
      name: "",
      type: "RESTAURANT",
      address: "",
      phone_number: "",
      description: "",
      is_active: false,
      is_open: false,
      admin: [],
      company: [],
      location: { lat: undefined, lng: undefined },
    });
    setModalOpen(true);
  }, [clearSelectedStore]);

  const openEditModal = useCallback(
    (store: StoreType) => {
      setSelectedStore(store);
      setForm({
        name: store.name,
        type: store.type,
        address: store.address,
        phone_number: store.phone_number ?? "",
        description: store.description ?? "",
        is_active: store.is_active,
        is_open: store.is_open,
        admin: store.admin || [],
        company: store.company || [],
        location: store.location || { lat: undefined, lng: undefined },
      });
      setModalOpen(true);
    },
    [setSelectedStore]
  );

  const confirmDelete = useCallback((store: StoreType) => {
    setItemToDelete(store);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await deleteStore(itemToDelete._id);
      fetchStores();
      showToast("success", t("store.message.deleted") || "Restaurant deleted");
    } catch {
      showToast(
        "error",
        t("store.message.deleteFailed") || "Failed to delete restaurant"
      );
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, fetchStores, t]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("storeFilters");
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("store.title") || "Manage Store"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("store.createStore") || "Create Store"}
        </Button>
      </div>

      <StoreFilters
        filters={filters}
        setFilters={handleFilterChange}
        resetFilters={resetFilters}
        companies={companiesList}
        admins={usersList.filter((user) => user.role === "ADMIN")}
        storeTypes={storeTypes}
      />

      <StoreTable
        stores={stores}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <StoreModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEditing={!!selectedStore}
        companies={companiesList || []}
        users={usersList || []}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={performDelete}
        onClose={() => setDeleteModalOpen(false)}
        title={t("store.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("store.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this store?"
        }
      />
    </div>
  );
}
