import React, { useCallback } from "react";
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

export interface ColumnDef<T> {
  /** property key in the row object */
  key: keyof T;
  /** header label */
  label: string;
  /** optional custom cell render */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  sortKey: keyof T;
  sortDirection: "asc" | "desc";
  loading?: boolean;
  onSort: (key: keyof T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  noDataText?: string;
}

export function DataTable<T extends { _id: string | number }>({
  columns,
  data,
  sortKey,
  sortDirection,
  loading = false,
  onSort,
  onEdit,
  onDelete,
  noDataText = "No data found.",
}: DataTableProps<T>) {
  const handleSort = useCallback((key: keyof T) => () => onSort(key), [onSort]);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={String(col.key)}
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
          {(onEdit || onDelete) && (
            <TableHead className="text-right">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>

      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
              className="text-center py-8"
            >
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
              className="text-center py-8"
            >
              {noDataText}
            </TableCell>
          </TableRow>
        ) : (
          data.map((row) => (
            <TableRow key={row._id}>
              {columns.map((col) => (
                <TableCell key={String(col.key)}>
                  {col.render ? col.render(row) : (row[col.key] as any) ?? "-"}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="text-right space-x-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(row)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
