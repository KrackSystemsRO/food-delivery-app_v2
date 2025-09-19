import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import useStore from "@/stores/store.store";
import useUserStore from "@/stores/user.store";
import useCompanyStore from "@/stores/company.store";
import { StoreFilters } from "@/components/store/StoreFilters";
import StoreTable from "@/components/store/StoreTable";
import StoreFormModal from "@/components/store/StoreFormModal";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
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

const storeTypes = [
  "RESTAURANT",
  "GROCERY",
  "BAKERY",
  "CAFE",
  "OTHER",
] as const;

export default function StoreManagementPage() {
  const { t } = useTranslation();
  const {
    storesList,
    setStoresList,
    selectedStore,
    setSelectedStore,
    clearSelectedStore,
  } = useStore();
  const { usersList, setUsersList } = useUserStore();
  const { companiesList, setCompaniesList } = useCompanyStore();

  const [filters, setFilters] = useState(defaultFilters);
  const [debouncedFilters] = useDebounce(filters, 300);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<Types.Store.StoreType | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Store.StoreType;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });

  // Fetch stores
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Store.getStores(axiosInstance, {
        ...filters,
        page,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setStoresList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("store.loadFailed") || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setStoresList, t]);

  useEffect(() => {
    fetchStores();
  }, [debouncedFilters, page, sortConfig]);

  useEffect(() => {
    (async () => {
      const usersRes = await Services.User.getUsers(axiosInstance, {
        is_active: true,
      });
      setUsersList(usersRes.result);
      const companiesRes = await Services.Company.getCompanies(axiosInstance, {
        is_active: true,
      });
      setCompaniesList(companiesRes.result);
    })();
  }, [setUsersList, setCompaniesList]);

  const handleSort = useCallback((key: keyof Types.Store.StoreType) => {
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

  const openCreateModal = useCallback(() => {
    clearSelectedStore();
    setModalOpen(true);
  }, [clearSelectedStore]);
  const openEditModal = useCallback(
    (store: Types.Store.StoreType) => {
      setSelectedStore(store);
      setModalOpen(true);
    },
    [setSelectedStore]
  );

  const confirmDelete = useCallback((store: Types.Store.StoreType) => {
    setItemToDelete(store);
    setDeleteModalOpen(true);
  }, []);
  const performDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await Services.Store.deleteStore(axiosInstance, itemToDelete._id);
      showToast("success", t("store.message.deleted"));
      fetchStores();
    } catch {
      showToast("error", t("store.message.deleteFailed"));
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, fetchStores, t]);

  const handleSave = useCallback(() => {
    fetchStores();
    setModalOpen(false);
    clearSelectedStore();
  }, [fetchStores, clearSelectedStore]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("store.title") || "Manage Store"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("store.createStore")}
        </Button>
      </div>

      <StoreFilters
        filters={filters}
        setFilters={handleFilterChange}
        resetFilters={resetFilters}
        companies={companiesList}
        admins={usersList.filter((u) => u.role === "ADMIN")}
        storeTypes={storeTypes}
      />

      <StoreTable
        stores={storesList}
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

      <StoreFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedStore={selectedStore}
        companies={companiesList}
        admins={usersList.filter((u) => u.role === "ADMIN")}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("store.message.confirmDeleteTitle")}
        description={t("store.message.confirmDeleteDesc")}
      />
    </div>
  );
}
