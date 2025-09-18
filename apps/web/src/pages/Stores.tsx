import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/common/confirm.modal";
import { PaginationControls } from "@/components/common/pagination.common";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import useUserStore from "@/stores/user.store";
import useCompanyStore from "@/stores/company.store";
import useStore from "@/stores/store.store";
import { StoreFilters } from "@/components/store/filters.store";
import { FormModal } from "@/components/common/form-modal";
import { useDebounce } from "use-debounce";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

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

  const [itemToDelete, setItemToDelete] =
    useState<Types.Store.StoreType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState<Types.Store.StoreForm>({
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
    key: keyof Types.Store.StoreType;
    direction: "asc" | "desc";
  }>({
    key: "createdAt",
    direction: "desc",
  });
  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Store.getStores(axiosInstance, {
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
      const usersRes = await Services.User.getUsers(axiosInstance, {
        is_active: true,
      });
      setUsersList(usersRes.result);
      const companyRes = await Services.Company.getCompanies(axiosInstance, {
        is_active: true,
      });
      setCompaniesList(companyRes.result);
    })();
  }, [setUsersList, setCompaniesList]);

  useEffect(() => {
    fetchStores();
  }, [debouncedFilters, page, sortConfig]);

  useEffect(() => {
    localStorage.setItem("storeFilters", JSON.stringify(filters));
  }, [filters]);

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

  const handleSubmit = useCallback(async () => {
    if (!form.name) {
      showToast("error", t("store.message.allFieldsRequired"));
      return;
    }

    try {
      if (selectedStore) {
        const res = await Services.Store.updateStore(
          axiosInstance,
          selectedStore._id,
          form
        );
        if (res.status === 200) {
          showToast("success", t("store.message.updated"));
          updateStoreInList(res.result);
        } else throw new Error();
      } else {
        const res = await Services.Store.addStore(axiosInstance, form);
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
    (store: Types.Store.StoreType) => {
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

  const confirmDelete = useCallback((store: Types.Store.StoreType) => {
    setItemToDelete(store);
    setDeleteModalOpen(true);
  }, []);

  const performDelete = useCallback(async () => {
    if (!itemToDelete) return;
    try {
      await Services.Store.deleteStore(axiosInstance, itemToDelete._id);
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

  const columns: ColumnDef<Types.Store.StoreType>[] = [
    { key: "name", label: t("store.name") || "Name" },
    { key: "type", label: t("store.type") || "Type" },
    { key: "address", label: t("store.address") || "Address" },
    {
      key: "is_active",
      label: t("store.active") || "Active",
      render: (store) => (store.is_active ? "Yes" : "No"),
    },
    {
      key: "is_open",
      label: t("store.open") || "Open",
      render: (store) => (store.is_open ? "Yes" : "No"),
    },
    {
      key: "admin",
      label: t("store.admin") || "Admin",
      render: (store) =>
        store.admin?.map((u) => u.first_name).join(", ") || "-",
    },
    {
      key: "company",
      label: t("store.company") || "Company",
      render: (store) => store.company?.map((c) => c.name).join(", ") || "-",
    },
  ];

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

      <DataTable
        columns={columns}
        data={stores}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("store.noStores") || "No stores found."}
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
          selectedStore
            ? t("store.editTitle") || "Edit Store"
            : t("store.createTitle") || "Create Store"
        }
        description={
          selectedStore
            ? t("store.editDesc") || "Update store details."
            : t("store.createDesc") ||
              "Fill in the details to create a new store."
        }
        submitLabel={
          selectedStore
            ? t("common.button.update") || "Update"
            : t("common.button.save") || "Save"
        }
        cancelLabel={t("common.button.cancel") || "Cancel"}
      >
        {/* ----------- Store Form Fields ----------- */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.name") || "Name"}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.type") || "Type"}
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {storeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.address") || "Address"}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.phone") || "Phone Number"}
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={form.phone_number}
              onChange={(e) =>
                setForm({ ...form, phone_number: e.target.value })
              }
            />
          </div>

          {/* Active & Open toggles */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <span>{t("store.active") || "Active"}</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={form.is_open}
                onChange={(e) =>
                  setForm({ ...form, is_open: e.target.checked })
                }
              />
              <span>{t("store.open") || "Open"}</span>
            </label>
          </div>

          {/* Company selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.company") || "Company"}
            </label>
            <select
              multiple
              className="w-full border rounded px-3 py-2"
              value={form.company.map((c) => c._id)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                );
                const newCompanies = companiesList.filter((c) =>
                  selected.includes(c._id)
                );
                setForm({ ...form, company: newCompanies });
              }}
            >
              {companiesList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Admin selection */}
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("store.admin") || "Admin"}
            </label>
            <select
              multiple
              className="w-full border rounded px-3 py-2"
              value={form.admin.map((a) => a._id)}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map(
                  (o) => o.value
                );
                const newAdmins = usersList
                  .filter((u) => u.role === "ADMIN")
                  .filter((u) => selected.includes(u._id));
                setForm({ ...form, admin: newAdmins });
              }}
            >
              {usersList
                .filter((u) => u.role === "ADMIN")
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.first_name} {u.last_name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </FormModal>

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
