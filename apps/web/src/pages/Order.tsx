import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { showToast } from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { PaginationControls } from "@/components/common/PaginationControls";
import useOrderStore from "@/stores/orderStore";
import {
  OrderFilters,
  type FiltersType,
} from "@/components/order/OrderFilters";
import usePersistedState from "@/hooks/use-persisted-state";
import { Services, Types } from "@my-monorepo/shared";
import axiosInstance from "@/utils/request/authorizedRequest";
import OrderFormModal from "@/components/order/OrderFormModal";
import OrderTable from "@/components/order/OrderTable";
import { ConfirmModal } from "@/components/common/ConfirmModal";

const defaultFilters: FiltersType = {
  search: "",
  status: undefined,
  limit: 10,
};
type SortKey = "user" | "createdAt" | "status";

export default function OrderManagementPage() {
  const { t } = useTranslation();
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
  }>({ key: "createdAt", direction: "desc" });

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
      if (orders.length === 1 && page > 1) setPage((prev) => prev - 1);
      else fetchOrders();
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

  useEffect(() => setPage(1), [filters, sortConfig]);
  useEffect(() => {
    fetchOrders();
    return clearOrdersList;
  }, [fetchOrders, clearOrdersList, page]);

  const handleSort = useCallback(
    (key: keyof Types.Order.OrderType) => {
      if (!sortableKeys.includes(key as SortKey)) return;
      setSortConfig((current) => ({
        key: key as SortKey,
        direction:
          current.key === key && current.direction === "asc" ? "desc" : "asc",
      }));
    },
    [sortableKeys]
  );

  const updateFilters = useCallback(
    (updated: Partial<FiltersType>) =>
      setFilters((prev) => ({ ...prev, ...updated })),
    [setFilters]
  );
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPage(1);
    setSortConfig({ key: "createdAt", direction: "desc" });
    localStorage.removeItem("orderFilters");
  }, [setFilters]);
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
  const confirmDelete = useCallback((order: Types.Order.OrderType) => {
    setOrderToDelete(order);
    setDeleteModalOpen(true);
  }, []);

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
      <OrderTable
        orders={orders}
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

      <OrderFormModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        selectedOrder={selectedOrder}
        refreshList={fetchOrders}
      />
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
