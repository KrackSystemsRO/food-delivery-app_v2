import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/data-table";
import { Types } from "@my-monorepo/shared";

interface StoreTableProps {
  stores: Types.Store.StoreType[];
  loading: boolean;
  sortKey: keyof Types.Store.StoreType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Store.StoreType) => void;
  onEdit: (store: Types.Store.StoreType) => void;
  onDelete: (store: Types.Store.StoreType) => void;
  t: (key: string) => string;
}

function StoreTableComponent({
  stores,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: StoreTableProps) {
  const columns: ColumnDef<Types.Store.StoreType>[] = useMemo(
    () => [
      { key: "name", label: t("store.name") || "Name" },
      { key: "type", label: t("store.type") || "Type" },
      { key: "address", label: t("store.address") || "Address" },
      {
        key: "is_active",
        label: t("store.active") || "Active",
        render: (store) => (store.is_active ? "Yes" : "No"),
      },
      {
        key: "is_open",
        label: t("store.open") || "Open",
        render: (store) => (store.is_open ? "Yes" : "No"),
      },
      {
        key: "admin",
        label: t("store.admin") || "Admin",
        render: (store) =>
          store.admin?.map((u) => u.first_name).join(", ") || "-",
      },
      {
        key: "company",
        label: t("store.company") || "Company",
        render: (store) => store.company?.map((c) => c.name).join(", ") || "-",
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={stores}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("store.noStores") || "No stores found."}
    />
  );
}

export default memo(
  StoreTableComponent,
  (prev, next) =>
    prev.stores === next.stores &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.t === next.t &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
