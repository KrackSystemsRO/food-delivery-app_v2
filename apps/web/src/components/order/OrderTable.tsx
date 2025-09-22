import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/DataTable";
import { Types } from "@my-monorepo/shared";

interface OrderTableProps {
  orders: Types.Order.OrderType[];
  loading: boolean;
  sortKey: keyof Types.Order.OrderType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Order.OrderType) => void;
  onEdit: (order: Types.Order.OrderType) => void;
  onDelete: (order: Types.Order.OrderType) => void;
  t: (key: string) => string;
}

function OrderTableComponent({
  orders,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: OrderTableProps) {
  const columns: ColumnDef<Types.Order.OrderType>[] = useMemo(
    () => [
      {
        key: "user",
        label: t("order.table.user") || "User",
        render: (row) => row.user?.first_name || "-",
      },
      {
        key: "status",
        label: t("order.table.status") || "Status",
        render: (row) => t(`order.status.${row.status}`) || row.status,
      },
      {
        key: "createdAt",
        label: t("order.table.createdAt") || "Created At",
        render: (row) => new Date(row.createdAt).toLocaleString(),
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={orders}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("common.table.noData") || "No orders found."}
    />
  );
}

export default memo(
  OrderTableComponent,
  (prev, next) =>
    prev.orders === next.orders &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.t === next.t &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
