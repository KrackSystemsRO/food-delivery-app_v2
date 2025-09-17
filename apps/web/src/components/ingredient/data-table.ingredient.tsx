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
import { useCallback, useMemo } from "react";
import type { IngredientType } from "@/types/ingredient.type";

interface IngredientTableProps {
  ingredients: IngredientType[];
  sortKey: keyof IngredientType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof IngredientType) => void;
  onEdit: (ingredient: IngredientType) => void;
  onDelete: (ingredient: IngredientType) => void;
}

export function IngredientTable({
  ingredients,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: IngredientTableProps) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      {
        key: "name" as keyof IngredientType,
        label: t("common.table.name") || "Name",
      },
      {
        key: "description" as keyof IngredientType,
        label: t("common.table.description") || "Description",
      },
      {
        key: "is_active" as keyof IngredientType,
        label: t("common.table.is_active") || "Status",
      },
    ],
    [t]
  );

  const renderCell = useCallback(
    (ingredient: IngredientType, key: keyof IngredientType) => {
      const value = ingredient[key];

      if (key === "is_active") {
        return value ? (
          <Check className="text-green-500 inline-block" />
        ) : (
          <X className="text-red-500 inline-block" />
        );
      }

      if (typeof value === "string" || typeof value === "number") {
        return value;
      }

      if (typeof value === "object" && value !== null) {
        return JSON.stringify(value);
      }

      return "-";
    },
    []
  );

  const renderedRows = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} className="text-center py-8">
            <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
          </TableCell>
        </TableRow>
      );
    }

    if (ingredients.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length + 1} className="text-center py-8">
            {t("common.table.noData") || "No ingredients found."}
          </TableCell>
        </TableRow>
      );
    }

    return ingredients.map((ingredient) => (
      <TableRow key={ingredient._id}>
        {columns.map((col) => (
          <TableCell key={col.key}>{renderCell(ingredient, col.key)}</TableCell>
        ))}
        <TableCell className="text-right space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(ingredient)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(ingredient)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [ingredients, columns, loading, onEdit, onDelete, renderCell, t]);

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

      <TableBody>{renderedRows}</TableBody>
    </Table>
  );
}
