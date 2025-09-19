import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { PaginationControls } from "@/components/common/PaginationControls";
import useDepartmentStore from "@/stores/departmentStore";
import useUserStore from "@/stores/userStore";
import useCompanyStore from "@/stores/companyStore";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import {
  DepartmentFilters,
  type FiltersType,
} from "@/components/department/DepartmentFilters";
import { DepartmentFormModal } from "@/components/department/DepartmentFormModal";
import DepartmentTable from "@/components/department/DepartmentTable";

const defaultFilters: FiltersType = {
  search: "",
  is_active: undefined,
  limit: 10,
  company: "",
};

export default function DepartmentManagementPage() {
  const { t } = useTranslation();

  const [departmentToDelete, setDepartmentToDelete] =
    useState<Types.Department.DepartmentType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const { usersList, setUsersList } = useUserStore();
  const { companiesList, setCompaniesList } = useCompanyStore();
  const {
    departmentsList,
    setDepartmentsList,
    clearDepartmentsList,
    selectedDepartment,
    setSelectedDepartment,
    clearSelectedDepartment,
    updateDepartmentInList,
  } = useDepartmentStore();

  const [form, setForm] = useState<Types.Department.DepartmentForm>({
    name: "",
    description: "",
    is_active: true,
    company: [],
    admin: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Department.DepartmentType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Department.getDepartments(axiosInstance, {
        search: filters.search,
        is_active: filters.is_active,
        company: filters.company || "",
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
        Services.User.getUsers(axiosInstance, { is_active: true }),
        Services.Company.getCompanies(axiosInstance, { is_active: true }),
      ]);
      setUsersList(usersRes.result);
      setCompaniesList(companiesRes.result);
    })();
  }, [setUsersList, setCompaniesList]);

  useEffect(() => {
    fetchDepartments();
    return () => clearDepartmentsList();
  }, [fetchDepartments, clearDepartmentsList]);

  const handleSort = useCallback(
    (key: keyof Types.Department.DepartmentType) => {
      setSortConfig((current) => ({
        key,
        direction:
          current.key === key
            ? current.direction === "asc"
              ? "desc"
              : "asc"
            : "asc",
      }));
    },
    []
  );

  const openCreateModal = useCallback(() => {
    clearSelectedDepartment();
    setForm({
      name: "",
      description: "",
      is_active: true,
      company: [],
      admin: [],
    });
    setModalOpen(true);
  }, [clearSelectedDepartment]);

  const openEditModal = useCallback(
    (department: Types.Department.DepartmentType) => {
      setSelectedDepartment(department);
      setForm({
        name: department.name,
        description: department.description || "",
        is_active: department.is_active,
        company: department.company || [],
        admin: department.admin || [],
      });
      setModalOpen(true);
    },
    [setSelectedDepartment]
  );

  const confirmDelete = useCallback(
    (department: Types.Department.DepartmentType) => {
      setDepartmentToDelete(department);
      setDeleteModalOpen(true);
    },
    []
  );

  const performDelete = useCallback(async () => {
    if (!departmentToDelete) return;
    try {
      await Services.Department.deleteDepartment(
        axiosInstance,
        departmentToDelete._id
      );
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
        const res = await Services.Department.updateDepartment(
          axiosInstance,
          selectedDepartment._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("department.message.updated"));
          updateDepartmentInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Department.addDepartment(
          axiosInstance,
          form
        );
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
        setFilters={(updated) =>
          setFilters((prev) => ({ ...prev, ...updated }))
        }
        resetFilters={resetFilters}
        companies={companiesList}
      />

      <DepartmentTable
        data={departmentsList}
        loading={loading}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
        form={form}
        setForm={setForm}
        usersList={usersList}
        companiesList={companiesList}
        selectedDepartment={selectedDepartment}
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
