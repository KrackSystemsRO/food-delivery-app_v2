import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import useCompanyStore from "@/stores/company.store";
import useUserStore from "@/stores/user.store";
import {
  CompanyFilters,
  type FiltersType,
} from "@/components/company/CompanyFilters";
import CompanyTable from "@/components/company/CompanyTable";
import { CompanyFormModal } from "@/components/company/CompanyFormModal";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

const defaultFilters: FiltersType = {
  search: "",
  type: "",
  is_active: undefined,
  limit: 10,
};

export default function CompanyManagementPage() {
  const { t } = useTranslation();
  const { usersList, setUsersList } = useUserStore();
  const {
    companiesList: companies,
    setCompaniesList,
    clearCompaniesList,
    selectedCompany,
    setSelectedCompany,
    clearSelectedCompany,
    updateCompanyInList,
  } = useCompanyStore();

  const [form, setForm] = useState<Types.Company.CompanyForm>({
    name: "",
    address: "",
    type: undefined,
    email: "",
    phone_number: "",
    is_active: true,
    admin: [],
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Types.Company.CompanyType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] =
    useState<Types.Company.CompanyType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Company.getCompanies(axiosInstance, {
        search: filters.search,
        type: (filters.type === "" ? undefined : filters.type) as
          | "PROVIDER"
          | "CLIENT"
          | undefined,
        is_active: filters.is_active,
        page,
        limit: filters.limit,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setCompaniesList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("company.loadFailed") || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setCompaniesList, t]);

  useEffect(() => {
    (async () => {
      const users = await Services.User.getUsers(axiosInstance, {
        is_active: true,
      });
      setUsersList(users.result);
    })();
  }, [setUsersList]);

  useEffect(() => {
    fetchCompanies();
    return () => clearCompaniesList();
  }, [fetchCompanies, clearCompaniesList]);

  useEffect(() => {
    localStorage.setItem("companyFilters", JSON.stringify(filters));
  }, [filters]);

  const handleSort = useCallback((key: keyof Types.Company.CompanyType) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedCompany();
    setForm({
      name: "",
      address: "",
      type: undefined,
      email: "",
      phone_number: "",
      is_active: true,
      admin: [],
    });
    setModalOpen(true);
  }, [clearSelectedCompany]);

  const openEditModal = useCallback(
    (company: Types.Company.CompanyType) => {
      setSelectedCompany(company);
      setForm({ ...company });
      setModalOpen(true);
    },
    [setSelectedCompany]
  );

  const confirmDelete = useCallback((company: Types.Company.CompanyType) => {
    setCompanyToDelete(company);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!companyToDelete) return;
    try {
      await Services.Company.deleteCompany(axiosInstance, companyToDelete._id);
      fetchCompanies();
      showToast("success", t("company.message.deleted") || "Company deleted");
    } catch {
      showToast(
        "error",
        t("company.message.deleteFailed") || "Failed to delete company"
      );
    } finally {
      setDeleteModalOpen(false);
      setCompanyToDelete(null);
    }
  }, [companyToDelete, fetchCompanies, t]);

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.type) {
      showToast("error", t("company.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedCompany) {
        const res = await Services.Company.updateCompany(
          axiosInstance,
          selectedCompany._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("company.message.updated"));
          updateCompanyInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Company.addCompany(axiosInstance, form);
        if (res.status === 201) {
          showToast("success", t("company.message.created"));
          fetchCompanies();
        } else throw new Error();
      }
      setModalOpen(false);
      clearSelectedCompany();
    } catch {
      showToast("error", t("company.message.submitFailed"));
    }
  }, [
    form,
    selectedCompany,
    fetchCompanies,
    updateCompanyInList,
    clearSelectedCompany,
    t,
  ]);
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("companyFilters");
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("company.title") || "Manage Companies"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("company.createCompany") || "Create Company"}
        </Button>
      </div>

      <CompanyFilters
        filters={filters}
        setFilters={(updated: Partial<FiltersType>) => {
          setFilters((prev) => ({
            ...prev,
            ...updated,
            type: updated.type ? (updated.type as "PROVIDER" | "CLIENT") : "",
          }));
          setPage(1);
        }}
        resetFilters={resetFilters}
      />

      {/* Table */}
      <CompanyTable
        data={companies}
        loading={loading}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
      />

      {/* Pagination */}
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Form Modal */}
      <CompanyFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        loading={loading}
        form={form}
        setForm={setForm}
        selectedCompany={selectedCompany}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        title={t("company.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("company.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this company? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}
