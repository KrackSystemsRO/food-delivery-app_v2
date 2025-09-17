import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

import { ConfirmModal } from "@/components/user/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";

import type { DepartmentForm, DepartmentType } from "@/types/department.type";
import {
  addDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "@/services/department.service";

import useDepartmentStore from "@/stores/department.store";
import { DepartmentTable } from "@/components/department/data-table.department";
import { DepartmentFilters } from "@/components/department/filters.department";
import DepartmentModal from "@/components/department/department.modal";

import useUserStore from "@/stores/user.store";
import { getUsers } from "@/services/user.service";
import { getCompanies } from "@/services/company.service";
import useCompanyStore from "@/stores/company.store";

const defaultFilters = {
  search: "",
  is_active: undefined,
  limit: 10,
  company: "",
};

export default function DepartmentManagementPage() {
  const { t } = useTranslation();

  const [departmentToDelete, setDepartmentToDelete] =
    useState<DepartmentType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const { usersList, setUsersList } = useUserStore();
  const { companiesList, setCompaniesList } = useCompanyStore();

  const [form, setForm] = useState<DepartmentForm>({
    name: "",
    description: undefined,
    is_active: true,
    company: [],
    admin: [],
  });

  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem("departmentFilters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          search: parsed.search || "",
          is_active: parsed.is_active ?? undefined,
          limit: parsed.limit ? Number(parsed.limit) : 10,
          company: parsed.company || "",
        };
      } catch {
        return defaultFilters;
      }
    }
    return defaultFilters;
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof DepartmentType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const {
    departmentsList,
    setDepartmentsList,
    clearDepartmentsList,
    selectedDepartment,
    setSelectedDepartment,
    clearSelectedDepartment,
    updateDepartmentInList,
  } = useDepartmentStore();

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDepartments({
        search: filters.search,
        is_active: filters.is_active,
        company: filters.company,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setDepartmentsList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast(
        "error",
        t("department.loadFailed") || "Failed to load departments"
      );
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setDepartmentsList, t]);

  useEffect(() => {
    (async () => {
      const [usersRes, companiesRes] = await Promise.all([
        getUsers({ is_active: true }),
        getCompanies({ is_active: true }),
      ]);
      setUsersList(usersRes.result);
      setCompaniesList(companiesRes.result);
    })();
  }, [setUsersList, setCompaniesList]);

  useEffect(() => {
    fetchDepartments();
    return () => clearDepartmentsList();
  }, [fetchDepartments, clearDepartmentsList]);

  useEffect(() => {
    localStorage.setItem("departmentFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback((key: keyof DepartmentType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key
          ? current.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedDepartment();
    setForm({
      name: "",
      description: undefined,
      is_active: true,
      company: [],
      admin: [],
    });
    setModalOpen(true);
  }, [clearSelectedDepartment]);

  const openEditModal = useCallback(
    (department: DepartmentType) => {
      setSelectedDepartment(department);
      setForm({
        name: department.name,
        description: department.description,
        is_active: department.is_active,
        company: department.company || [],
        admin: department.admin || [],
      });
      setModalOpen(true);
    },
    [setSelectedDepartment]
  );

  const confirmDelete = useCallback((department: DepartmentType) => {
    setDepartmentToDelete(department);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!departmentToDelete) return;
    try {
      await deleteDepartment(departmentToDelete._id);
      fetchDepartments();
      showToast("success", t("department.message.deleted"));
    } catch {
      showToast("error", t("department.message.deleteFailed"));
    } finally {
      setDeleteModalOpen(false);
      setDepartmentToDelete(null);
    }
  }, [departmentToDelete, fetchDepartments, t]);

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.company.length) {
      showToast("error", t("department.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedDepartment) {
        const res = await updateDepartment(selectedDepartment._id, form);
        if (res.status === 200) {
          showToast("success", t("department.message.updated"));
          updateDepartmentInList(res.result);
        } else throw new Error();
      } else {
        const res = await addDepartment(form);
        if (res.status === 201) {
          showToast("success", t("department.message.created"));
          fetchDepartments();
        } else throw new Error();
      }

      setModalOpen(false);
      clearSelectedDepartment();
    } catch {
      showToast("error", t("department.message.submitFailed"));
    }
  }, [
    form,
    selectedDepartment,
    updateDepartmentInList,
    fetchDepartments,
    clearSelectedDepartment,
    t,
  ]);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("departmentFilters");
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("department.title") || "Manage Departments"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("department.createDepartment") || "Create Department"}
        </Button>
      </div>

      <DepartmentFilters
        filters={filters}
        setFilters={(updated) => {
          setFilters((prev) => ({ ...prev, ...updated }));
          setPage(1);
        }}
        resetFilters={resetFilters}
        companies={companiesList}
      />

      <DepartmentTable
        departments={departmentsList}
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

      <DepartmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          clearDepartmentsList();
          fetchDepartments();
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEditing={!!selectedDepartment}
        users={usersList}
        companies={companiesList}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("department.message.confirmDeleteTitle")}
        description={t("department.message.confirmDeleteDesc")}
        confirmText={t("common.button.delete")}
        cancelText={t("common.button.cancel")}
      />
    </div>
  );
}
