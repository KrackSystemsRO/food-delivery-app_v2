import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/DataTable";
import { Types } from "@my-monorepo/shared";

interface UserTableProps {
  users: Types.User.UserType[];
  loading: boolean;
  sortKey: keyof Types.User.UserType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.User.UserType) => void;
  onEdit: (user: Types.User.UserType) => void;
  onDelete: (user: Types.User.UserType) => void;
  t: (key: string) => string;
}

function UserTableComponent({
  users,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: UserTableProps) {
  const columns: ColumnDef<Types.User.UserType>[] = useMemo(
    () => [
      { key: "first_name", label: t("user.firstName") || "First Name" },
      { key: "last_name", label: t("user.lastName") || "Last Name" },
      { key: "email", label: t("user.email") || "Email" },
      { key: "role", label: t("user.role") || "Role" },
      {
        key: "is_active",
        label: t("user.active") || "Active",
        render: (user) => (user.is_active ? "Yes" : "No"),
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("user.noUsers") || "No users found."}
    />
  );
}

export default memo(
  UserTableComponent,
  (prev, next) =>
    prev.users === next.users &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection &&
    prev.t === next.t &&
    prev.onEdit === next.onEdit &&
    prev.onDelete === next.onDelete
);
