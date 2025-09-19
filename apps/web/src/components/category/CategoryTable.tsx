import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { Check, X } from "lucide-react";
import { Types } from "@my-monorepo/shared";

interface CategoryTableProps {
  data: Types.Category.CategoryType[];
  loading: boolean;
  sortKey: keyof Types.Category.CategoryType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Category.CategoryType) => void;
  onEdit: (row: Types.Category.CategoryType) => void;
  onDelete: (row: Types.Category.CategoryType) => void;
  t: (key: string) => string;
}

function CategoryTableComponent({
  data,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: CategoryTableProps) {
  const columns: ColumnDef<Types.Category.CategoryType>[] = useMemo(
    () => [
      { key: "name", label: t("common.table.name") || "Name" },
      {
        key: "description",
        label: t("common.table.description") || "Description",
      },
      {
        key: "is_active",
        label: t("common.table.is_active") || "Active",
        render: (row) =>
          row.is_active ? (
            <Check className="text-green-500 inline-block" />
          ) : (
            <X className="text-red-500 inline-block" />
          ),
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("common.table.noData") || "No categories found."}
    />
  );
}

export default memo(
  CategoryTableComponent,
  (prev, next) =>
    prev.data === next.data &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
