import { useMemo, memo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/components/ui";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OrderType } from "@/types/order.type";

interface OrderTableProps {
  orders: OrderType[];
  sortKey: keyof OrderType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof OrderType) => void;
  onEdit: (order: OrderType) => void;
  onDelete: (order: OrderType) => void;
}

const OrderRow = memo(function OrderRow({
  order,
  onEdit,
  onDelete,
}: {
  order: OrderType;
  onEdit: (order: OrderType) => void;
  onDelete: (order: OrderType) => void;
}) {
  const handleEdit = useCallback(() => onEdit(order), [onEdit, order]);
  const handleDelete = useCallback(() => onDelete(order), [onDelete, order]);

  return (
    <TableRow key={order._id}>
      {/* Show full customer name */}
      <TableCell>
        {order.user?.first_name} {order.user?.last_name}
      </TableCell>

      {/* Show order total */}
      <TableCell>{order.total?.toFixed(2) || "-"}</TableCell>

      {/* Show order status */}
      <TableCell>{order.status}</TableCell>

      {/* Show creation date */}
      <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>

      {/* Actions */}
      <TableCell className="text-right space-x-2">
        <Button size="sm" variant="outline" onClick={handleEdit}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

export const OrderTable = memo(function OrderTable({
  orders,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: OrderTableProps) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        key: "user" as keyof OrderType,
        label: t("common.table.customer") || "Customer",
      },
      {
        key: "total" as keyof OrderType,
        label: t("common.table.total") || "Total",
      },
      {
        key: "status" as keyof OrderType,
        label: t("common.form.label.status") || "Status",
      },
      {
        key: "createdAt" as keyof OrderType,
        label: t("common.table.createdAt") || "Created At",
      },
    ],
    [t]
  );

  const handleSort = useCallback(
    (key: keyof OrderType) => () => onSort(key),
    [onSort]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              onClick={handleSort(col.key)}
              className="cursor-pointer select-none"
              aria-sort={
                sortKey === col.key
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined
              }
            >
              {col.label}{" "}
              {sortKey === col.key && (sortDirection === "asc" ? "▲" : "▼")}
            </TableHead>
          ))}
          <TableHead className="text-right">
            {t("common.table.actions")}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        ) : orders.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData") || "No orders found."}
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
});
