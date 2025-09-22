import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PaginationControls } from "@/components/common/PaginationControls";
import useUserStore from "stores/userStore";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { UserFilters, type FiltersType } from "@/components/user/UserFilters";
import UserTable from "@/components/user/UserTable";
import UserFormModal from "@/components/user/UserFormModal";

const defaultFilters: FiltersType = {
  search: "",
  role: "",
  is_active: undefined,
  limit: 10,
};

export default function UserManagementPage() {
  const { t } = useTranslation();
  const {
    usersList,
    setUsersList,
    selectedUser,
    setSelectedUser,
    clearSelectedUser,
    clearUsersList,
  } = useUserStore();

  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.User.UserType;
    direction: "asc" | "desc";
  }>({ key: "createdAt", direction: "desc" });
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Types.User.UserType | null>(
    null
  );

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.User.getUsers(axiosInstance, {
        ...filters,
        page,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setUsersList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("user.loadFailed") || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setUsersList, t]);

  useEffect(() => {
    fetchUsers();
    return () => clearUsersList();
  }, [fetchUsers, clearUsersList]);

  const handleSort = useCallback((key: keyof Types.User.UserType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleFilterChange = useCallback(
    (updated: Partial<Types.User.UserFiltersType>) => {
      setFilters((prev) => ({ ...prev, ...updated }));
      setPage(1);
    },
    []
  );

  const openCreateModal = useCallback(() => {
    clearSelectedUser();
    setModalOpen(true);
  }, [clearSelectedUser]);
  const openEditModal = useCallback(
    (user: Types.User.UserType) => {
      setSelectedUser(user);
      setModalOpen(true);
    },
    [setSelectedUser]
  );

  const confirmDelete = useCallback((user: Types.User.UserType) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }, []);
  const performDelete = useCallback(async () => {
    if (!userToDelete) return;
    try {
      await Services.User.deleteUser(axiosInstance, userToDelete._id);
      showToast("success", t("user.message.deleted"));
      fetchUsers();
    } catch {
      showToast("error", t("user.message.deleteFailed"));
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete, fetchUsers, t]);

  const handleSave = useCallback(() => {
    fetchUsers();
    setModalOpen(false);
    clearSelectedUser();
  }, [fetchUsers, clearSelectedUser]);
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">{t("user.title")}</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("user.createUser")}
        </Button>
      </div>

      <UserFilters
        filters={filters}
        setFilters={handleFilterChange}
        resetFilters={resetFilters}
      />

      <UserTable
        users={usersList}
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedUser={selectedUser}
        onSave={handleSave}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("user.message.confirmDeleteTitle")}
        description={t("user.message.confirmDeleteDesc")}
        confirmText={t("common.button.delete")}
        cancelText={t("common.button.cancel")}
      />
    </div>
  );
}
