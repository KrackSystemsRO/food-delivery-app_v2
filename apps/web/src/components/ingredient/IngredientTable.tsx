import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/DataTable";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Types } from "@my-monorepo/shared";
import { useTranslation } from "react-i18next";

interface IngredientTableProps {
  ingredients: Types.Ingredient.IngredientType[];
  loading: boolean;
  page: number;
  totalPages: number;
  sortKey: keyof Types.Ingredient.IngredientType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Ingredient.IngredientType) => void;
  onEdit: (ingredient: Types.Ingredient.IngredientType) => void;
  onDelete: (ingredient: Types.Ingredient.IngredientType) => void;
  onPageChange: (page: number) => void;
}

function IngredientTableComponent({
  ingredients,
  loading,
  page,
  totalPages,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
}: IngredientTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<Types.Ingredient.IngredientType>[] = useMemo(
    () => [
      { key: "name", label: t("common.table.name") || "Name" },
      {
        key: "description",
        label: t("common.table.description") || "Description",
        render: (row) => row.description || "-",
      },
      {
        key: "is_active",
        label: t("common.table.is_active") || "Active",
        render: (row) =>
          row.is_active ? (
            <span className="text-green-600">{t("common.active")}</span>
          ) : (
            <span className="text-red-600">{t("common.inactive")}</span>
          ),
      },
    ],
    [t]
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={ingredients}
        sortKey={sortKey}
        sortDirection={sortDirection}
        loading={loading}
        onSort={onSort}
        onEdit={onEdit}
        onDelete={onDelete}
        noDataText={t("common.table.noData") || "No ingredients found."}
      />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}

export default memo(
  IngredientTableComponent,
  (prev, next) =>
    prev.ingredients === next.ingredients &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.page === next.page &&
    prev.totalPages === next.totalPages &&
    prev.onPageChange === next.onPageChange &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
