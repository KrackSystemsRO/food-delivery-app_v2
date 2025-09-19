import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { Check, X } from "lucide-react";
import { Types } from "@my-monorepo/shared";

interface AllergenTableProps {
  data: Types.Allergen.AllergenType[];
  loading: boolean;
  sortKey: keyof Types.Allergen.AllergenType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Allergen.AllergenType) => void;
  onEdit: (row: Types.Allergen.AllergenType) => void;
  onDelete: (row: Types.Allergen.AllergenType) => void;
  t: (key: string) => string;
}

function AllergenTableComponent({
  data,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: AllergenTableProps) {
  const columns: ColumnDef<Types.Allergen.AllergenType>[] = useMemo(
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
      noDataText={t("common.table.noData") || "No allergens found."}
    />
  );
}

export default memo(
  AllergenTableComponent,
  (prev, next) =>
    prev.data === next.data &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
