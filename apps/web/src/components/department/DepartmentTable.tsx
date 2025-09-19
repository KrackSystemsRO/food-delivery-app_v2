import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { Types } from "@my-monorepo/shared";
import { useTranslation } from "react-i18next";

interface DepartmentTableProps {
  data: Types.Department.DepartmentType[];
  loading: boolean;
  sortKey: keyof Types.Department.DepartmentType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Department.DepartmentType) => void;
  onEdit: (department: Types.Department.DepartmentType) => void;
  onDelete: (department: Types.Department.DepartmentType) => void;
}

function DepartmentTableComponent({
  data,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<Types.Department.DepartmentType>[] = useMemo(
    () => [
      { key: "name", label: t("common.table.name") || "Name" },
      {
        key: "company",
        label: t("common.table.company") || "Company",
        render: (row) => row.company?.map((c) => c.name).join(", ") || "-",
      },
      {
        key: "admin",
        label: t("common.table.admins") || "Admins",
        render: (row) => row.admin?.map((u) => u.first_name).join(", ") || "-",
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
    <DataTable
      columns={columns}
      data={data}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("common.table.noData") || "No departments found."}
    />
  );
}

export default memo(
  DepartmentTableComponent,
  (prev, next) =>
    prev.data === next.data &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
