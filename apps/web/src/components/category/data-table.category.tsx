import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/components/ui";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CategoryType } from "@/types/category.type";
import { useCallback, useMemo } from "react";

interface CategoryTableProps {
  categories: CategoryType[];
  sortKey: keyof CategoryType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof CategoryType) => void;
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

export function CategoryTable({
  categories,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { t } = useTranslation();

  const columns: { key: keyof CategoryType; label: string }[] = useMemo(
    () => [
      { key: "name", label: t("common.table.name") || "Name" },
      {
        key: "description",
        label: t("common.table.description") || "Description",
      },
      { key: "is_active", label: t("common.table.is_active") || "Status" },
    ],
    [t]
  );

  const renderRow = useCallback(
    (category: CategoryType) => (
      <TableRow key={category._id}>
        <TableCell>{category.name}</TableCell>
        <TableCell>{category.description || "-"}</TableCell>
        <TableCell>
          {category.is_active ? (
            <Check className="text-green-500 inline-block" />
          ) : (
            <X className="text-red-500 inline-block" />
          )}
        </TableCell>
        <TableCell className="text-right space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(category)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ),
    [onEdit, onDelete]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              onClick={() => onSort(col.key)}
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
        ) : categories.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData") || "No categories found."}
            </TableCell>
          </TableRow>
        ) : (
          categories.map(renderRow)
        )}
      </TableBody>
    </Table>
  );
}
