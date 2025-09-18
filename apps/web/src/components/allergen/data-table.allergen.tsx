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
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Types } from "@my-monorepo/shared";

interface AllergenTableProps {
  allergens: Types.Allergen.AllergenType[];
  sortKey: keyof Types.Allergen.AllergenType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof Types.Allergen.AllergenType) => void;
  onEdit: (allergen: Types.Allergen.AllergenType) => void;
  onDelete: (allergen: Types.Allergen.AllergenType) => void;
}

const AllergenRow = memo(function AllergenRow({
  allergen,
  onEdit,
  onDelete,
}: {
  allergen: Types.Allergen.AllergenType;
  onEdit: (allergen: Types.Allergen.AllergenType) => void;
  onDelete: (allergen: Types.Allergen.AllergenType) => void;
}) {
  const handleEdit = useCallback(() => onEdit(allergen), [onEdit, allergen]);
  const handleDelete = useCallback(
    () => onDelete(allergen),
    [onDelete, allergen]
  );

  return (
    <TableRow key={allergen._id}>
      <TableCell>{allergen.name}</TableCell>
      <TableCell>{allergen.description || "-"}</TableCell>
      <TableCell>
        {allergen.is_active ? (
          <Check className="text-green-500 inline-block" />
        ) : (
          <X className="text-red-500 inline-block" />
        )}
      </TableCell>
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

export const AllergenTable = memo(function AllergenTable({
  allergens,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: AllergenTableProps) {
  const { t } = useTranslation();

  const columns = useMemo(
    () => [
      { key: "name" as const, label: t("common.table.name") || "Name" },
      {
        key: "description" as const,
        label: t("common.table.description") || "Description",
      },
      {
        key: "is_active" as const,
        label: t("common.table.is_active") || "Status",
      },
    ],
    [t]
  );

  const handleSort = useCallback(
    (key: keyof Types.Allergen.AllergenType) => () => onSort(key),
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
        ) : allergens.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData") || "No allergens found."}
            </TableCell>
          </TableRow>
        ) : (
          allergens.map((allergen) => (
            <AllergenRow
              key={allergen._id}
              allergen={allergen}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
});
