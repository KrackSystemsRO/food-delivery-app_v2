import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { PaginationControls } from "@/components/common/pagination.common";
import useOrderStore from "@/stores/order.store";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { OrderFilters, type FiltersType } from "@/components/order/filters";
import { FormModal } from "@/components/common/form-modal";
import { ConfirmModal } from "@/components/common/confirm.modal";
import usePersistedState from "@/hooks/use-persisted-state";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";

const defaultFilters: FiltersType = {
  search: "",
  status: undefined,
  limit: 10,
};

type SortKey = "user" | "createdAt" | "status";

export default function OrderManagementPage() {
  const { t } = useTranslation();

  // --- State ---
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] =
    useState<Types.Order.OrderType | null>(null);

  const [filters, setFilters] = usePersistedState<FiltersType>(
    "orderFilters",
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
    ordersList: orders,
    setOrdersList,
    clearOrdersList,
    selectedOrder,
    setSelectedOrder,
    clearSelectedOrder,
  } = useOrderStore();

  const sortableKeys = useMemo<SortKey[]>(
    () => ["user", "createdAt", "status"],
    []
  );

  // --- API ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await Services.Order.getOrders(axiosInstance, {
        ...filters,
        page,
        sort_by: sortConfig.key,
        order: sortConfig.direction,
      });
      setOrdersList(res.result);
      setTotalPages(res.totalPages || 1);
    } catch {
      showToast("error", t("order.loadFailed") || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filters, page, sortConfig, setOrdersList, t]);

  const performDelete = useCallback(async () => {
    if (!orderToDelete) return;
    setDeleteLoading(true);
    try {
      await Services.Order.deleteOrder(axiosInstance, orderToDelete._id);
      showToast("success", t("order.message.deleted") || "Order deleted");

      // Refresh or go back a page if last item
      if (orders.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchOrders();
      }
    } catch {
      showToast(
        "error",
        t("order.message.deleteFailed") || "Failed to delete order"
      );
    } finally {
      setDeleteModalOpen(false);
      setOrderToDelete(null);
      setDeleteLoading(false);
    }
  }, [orderToDelete, fetchOrders, t, orders.length, page]);

  // --- Effects ---
  useEffect(() => setPage(1), [filters, sortConfig]);
  useEffect(() => {
    fetchOrders();
    return clearOrdersList;
  }, [fetchOrders, clearOrdersList, page]);

  // --- Handlers ---
  const handleSort = useCallback((key: keyof Types.Order.OrderType) => {
    if (!sortableKeys.includes(key as SortKey)) return;
    setSortConfig((current) => ({
      key: key as SortKey,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const openCreateModal = useCallback(() => {
    clearSelectedOrder();
    setModalOpen(true);
  }, [clearSelectedOrder]);

  const openEditModal = useCallback(
    (order: Types.Order.OrderType) => {
      setSelectedOrder(order);
      setModalOpen(true);
    },
    [setSelectedOrder]
  );
  const updateFilters = useCallback(
    (updated: Partial<FiltersType>) =>
      setFilters((prev) => ({ ...prev, ...updated })),
    [setFilters]
  );
  const confirmDelete = useCallback((order: Types.Order.OrderType) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("orderFilters");
  }, [setFilters]);

  const columns: ColumnDef<Types.Order.OrderType>[] = [
    {
      key: "user",
      label: t("order.table.user"),
      render: (row) => row.user?.first_name || "-",
    },
    {
      key: "status",
      label: t("order.table.status"),
      render: (row) => t(`order.status.${row.status}`) || row.status,
    },
    {
      key: "createdAt",
      label: t("order.table.createdAt"),
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  // --- Render ---
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold">
          {t("order.title") || "Manage Orders"}
        </h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          {t("order.create") || "Create Order"}
        </Button>
      </div>

      <OrderFilters
        filters={filters}
        setFilters={updateFilters}
        resetFilters={resetFilters}
      />

      <DataTable
        columns={columns}
        data={orders}
        sortKey={sortConfig.key}
        sortDirection={sortConfig.direction}
        loading={loading}
        onSort={handleSort}
        onEdit={openEditModal}
        onDelete={confirmDelete}
        noDataText={t("common.table.noData") || "No orders found."}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* Order modal */}
      {isModalOpen && (
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={() => {
            // TODO: Implement save logic (create or update order)
            showToast("success", t("order.message.saved") || "Order saved");
            setModalOpen(false);
          }}
          title={
            selectedOrder
              ? t("order.editTitle") || "Edit Order"
              : t("order.createTitle") || "Create Order"
          }
          description={
            selectedOrder
              ? t("order.editDesc") || "Update order details below."
              : t("order.createDesc") ||
                "Fill in details to create a new order."
          }
          submitLabel={
            selectedOrder
              ? t("common.button.update") || "Update"
              : t("common.button.save") || "Save"
          }
          cancelLabel={t("common.button.cancel") || "Cancel"}
          loading={loading}
        >
          {/* --- Form fields go here --- */}
          <div className="space-y-4">
            {/* Example: User */}
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("order.form.user") || "User"}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                defaultValue={selectedOrder?.user?.first_name || ""}
                disabled={!!selectedOrder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t("order.form.status") || "Status"}
              </label>
              <select
                className="w-full border rounded px-3 py-2"
                defaultValue={selectedOrder?.status || "pending"}
              >
                <option value="pending">
                  {t("order.status.pending") || "Pending"}
                </option>
                <option value="completed">
                  {t("order.status.completed") || "Completed"}
                </option>
                <option value="canceled">
                  {t("order.status.canceled") || "Canceled"}
                </option>
              </select>
            </div>
          </div>
        </FormModal>
      )}

      {/* Confirm delete */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={performDelete}
        loading={deleteLoading}
        title={t("order.message.confirmDeleteTitle") || "Confirm Delete"}
        description={
          t("order.message.confirmDeleteDesc") ||
          "Are you sure you want to delete this order? This action cannot be undone."
        }
        confirmText={t("common.button.delete") || "Delete"}
        cancelText={t("common.button.cancel") || "Cancel"}
      />
    </div>
  );
}
