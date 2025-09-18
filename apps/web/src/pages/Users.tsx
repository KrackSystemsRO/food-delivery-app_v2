import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { showToast } from "@/utils/toast";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { UserFilters } from "@/components/user/filters.user";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { PaginationControls } from "@/components/common/pagination.common";
import useUserStore from "@/stores/user.store";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import { FormModal } from "@/components/common/form-modal";

const defaultFilters: Types.User.UserFiltersType = {
  search: "",
  role: "",
  is_active: undefined,
  limit: 10,
};

export default function UserManagementPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [form, setForm] = useState<Types.User.UserForm>({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });
  const [userToDelete, setUserToDelete] = useState<Types.User.UserType | null>(
    null
  );
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("userFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultFilters,
          ...parsed,
          limit: Number(parsed.limit || 10),
        };
      } catch {
        return defaultFilters;
      }
    }
    return defaultFilters;
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.User.UserType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const {
    usersList: users,
    setUsersList,
    clearUsersList,
    selectedUser,
    setSelectedUser,
    clearSelectedUser,
    updateUserInList,
  } = useUserStore();

  // Fetch users
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

  useEffect(() => {
    localStorage.setItem("userFilters", JSON.stringify(filters));
  }, [filters]);

  // Sorting handler
  const handleSort = (key: keyof Types.User.UserType) =>
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));

  const openCreateModal = useCallback(() => {
    clearSelectedUser();
    setForm({ first_name: "", last_name: "", email: "", role: "" });
    setModalOpen(true);
  }, [clearSelectedUser]);

  const openEditModal = useCallback(
    (user: Types.User.UserType) => {
      setSelectedUser(user);
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      });
      setModalOpen(true);
    },
    [setSelectedUser]
  );

  const confirmDelete = useCallback((user: Types.User.UserType) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = async () => {
    if (!userToDelete) return;
    try {
      await Services.User.deleteUser(axiosInstance, userToDelete._id);
      showToast("success", t("user.message.deleted") || "User deleted");
      fetchUsers();
    } catch {
      showToast(
        "error",
        t("user.message.deleteFailed") || "Failed to delete user"
      );
    } finally {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = useCallback(async () => {
    const { first_name, last_name, email, role } = form;

    if (!first_name || !last_name || !email || !role) {
      return showToast(
        "error",
        t("user.message.allFieldsRequired") || "All fields are required"
      );
    }

    try {
      if (selectedUser) {
        const res = await Services.User.updateUser(
          axiosInstance,
          selectedUser._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("user.message.updated") || "User updated");
          updateUserInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.User.addUser(axiosInstance, form);
        if (res.status === 201) {
          showToast("success", t("user.message.created") || "User created");
          fetchUsers();
        } else throw new Error();
      }
      setModalOpen(false);
      clearSelectedUser();
    } catch {
      showToast(
        "error",
        t("user.message.submitFailed") || "Failed to submit user"
      );
    }
  }, [form, selectedUser, updateUserInList, fetchUsers, clearSelectedUser, t]);

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
    localStorage.removeItem("userFilters");
  };

  const columns: ColumnDef<Types.User.UserType>[] = [
    { key: "first_name", label: t("user.firstName") || "First Name" },
    { key: "last_name", label: t("user.lastName") || "Last Name" },
    { key: "email", label: t("user.email") || "Email" },
    { key: "role", label: t("user.role") || "Role" },
    {
      key: "is_active",
      label: t("user.active") || "Active",
      render: (user) => (user.is_active ? "Yes" : "No"),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("user.title") || "Manage Users"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("user.createUser") || "Create User"}
        </Button>
      </div>

      <UserFilters
        filters={filters}
        setFilters={(updated: Partial<typeof filters>) => {
          setFilters((prev: Types.User.UserFiltersType) => ({
            ...prev,
            ...updated,
          }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />

      <DataTable
        columns={columns}
        data={users}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("user.noUsers") || "No users found."}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          clearSelectedUser();
        }}
        onSubmit={handleSubmit}
        title={
          selectedUser
            ? t("user.editTitle") || "Edit User"
            : t("user.createTitle") || "Create User"
        }
        description={
          selectedUser
            ? t("user.editDesc") || "Update user details."
            : t("user.createDesc") ||
              "Fill in the details to create a new user."
        }
        submitLabel={
          selectedUser
            ? t("common.button.update") || "Update"
            : t("common.button.save") || "Save"
        }
        cancelLabel={t("common.button.cancel") || "Cancel"}
      >
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.firstName") || "First Name"}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.lastName") || "Last Name"}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.email") || "Email"}
            </label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("user.role") || "Role"}
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">
                {t("user.selectRole") || "Select a role"}
              </option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>
      </FormModal>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("user.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("user.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this user? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}
