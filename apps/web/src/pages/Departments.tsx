import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";

import { ConfirmModal } from "@/components/common/confirm.modal";
import { FormModal } from "@/components/common/form-modal";
import { PaginationControls } from "@/components/common/pagination.common";
import { LabeledInput } from "@/components/common/label-input";
import { CustomSelect } from "@/components/common/custom-select";

import useDepartmentStore from "@/stores/department.store";
import useUserStore from "@/stores/user.store";
import useCompanyStore from "@/stores/company.store";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { DepartmentFilters } from "@/components/department/filters.department";

import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

const defaultFilters = {
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

  useEffect(() => {
    localStorage.setItem("departmentFilters", JSON.stringify(filters));
  }, [filters]);

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
    localStorage.removeItem("departmentFilters");
  }, []);

  const columns: ColumnDef<Types.Department.DepartmentType>[] = [
    { key: "name", label: t("common.table.name") },
    {
      key: "company",
      label: t("common.table.company"),
      render: (row) => row.company?.map((c) => c.name).join(", ") || "-",
    },
    {
      key: "admin",
      label: t("common.table.admins"),
      render: (row) =>
        row.admin?.map((u: Types.User.UserType) => u.first_name).join(", ") ||
        "-",
    },
    {
      key: "is_active",
      label: t("common.table.is_active"),
      render: (row) =>
        row.is_active ? (
          <span className="text-green-600">{t("common.active")}</span>
        ) : (
          <span className="text-red-600">{t("common.inactive")}</span>
        ),
    },
  ];

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

      <DataTable
        columns={columns}
        data={departmentsList}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("common.table.noData") || "No departments found."}
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
          selectedDepartment
            ? t("department.editDepartment") || "Edit Department"
            : t("department.createDepartment") || "Create Department"
        }
        submitLabel={
          selectedDepartment
            ? t("common.button.update") || "Update"
            : t("common.button.create") || "Create"
        }
        cancelLabel={t("common.button.cancel") || "Cancel"}
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
        <CustomSelect
          label={t("common.form.label.companies") || "Companies"}
          multiple
          value={form.company.map((c) => c._id).filter(Boolean) as string[]}
          onValueChange={(vals: string[]) => {
            const selected = companiesList.filter((c) => vals.includes(c._id));
            setForm({ ...form, company: selected });
          }}
          options={companiesList.map((c) => ({ value: c._id, label: c.name }))}
        />

        <CustomSelect
          label={t("common.form.label.admins") || "Admins"}
          multiple
          value={form.admin.map((u) => u._id).filter(Boolean) as string[]}
          onValueChange={(vals: string[]) => {
            const selected = usersList.filter((u) => vals.includes(u._id));
            setForm({ ...form, admin: selected });
          }}
          options={usersList.map((u) => ({
            value: u._id,
            label: u.first_name,
          }))}
        />

        <CustomSelect<"active" | "inactive">
          label={t("common.form.label.status") || "Status"}
          value={form.is_active ? "active" : "inactive"}
          onValueChange={(val) =>
            setForm({ ...form, is_active: val === "active" })
          }
          options={[
            { value: "active", label: t("common.active") || "Active" },
            { value: "inactive", label: t("common.inactive") || "Inactive" },
          ]}
        />
      </FormModal>

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
