import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { Types } from "@my-monorepo/shared";
import { useTranslation } from "react-i18next";

interface CompanyTableProps {
  data: Types.Company.CompanyType[];
  loading: boolean;
  sortKey: keyof Types.Company.CompanyType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Company.CompanyType) => void;
  onEdit: (row: Types.Company.CompanyType) => void;
  onDelete: (row: Types.Company.CompanyType) => void;
}

function CompanyTableComponent({
  data,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  const { t } = useTranslation();

  const columns: ColumnDef<Types.Company.CompanyType>[] = useMemo(
    () => [
      { key: "name", label: t("common.table.name") || "Name" },
      { key: "email", label: t("common.table.email") || "Email" },
      { key: "phone_number", label: t("common.table.phone") || "Phone" },
      {
        key: "type",
        label: t("common.table.type") || "Type",
        render: (row) => t(`company.type.${row.type}`) || row.type,
      },
      {
        key: "is_active",
        label: t("common.table.is_active") || "Active",
        render: (row) =>
          row.is_active ? (
            <span className="text-green-600 font-medium">
              {t("common.active")}
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              {t("common.inactive")}
            </span>
          ),
      },
      {
        key: "admin",
        label: t("common.table.admins") || "Admins",
        render: (row) => row.admin?.map((u) => u.first_name).join(", ") || "-",
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
      noDataText={t("common.table.noData") || "No companies found."}
    />
  );
}

export default memo(
  CompanyTableComponent,
  (prev, next) =>
    prev.data === next.data &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
