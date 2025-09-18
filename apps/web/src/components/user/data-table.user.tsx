import { memo, useCallback } from "react";
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
interface UserTableProps {
  users: Types.User.UserType[];
  sortKey: keyof Types.User.UserType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof Types.User.UserType) => void;
  onEdit: (user: Types.User.UserType) => void;
  onDelete: (user: Types.User.UserType) => void;
}

function UserTableComponent({
  users,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: UserTableProps) {
  const { t } = useTranslation();

  const handleSort = useCallback(
    (field: keyof Types.User.UserType) => {
      onSort(field);
    },
    [onSort]
  );

  const handleEdit = useCallback(
    (user: Types.User.UserType) => {
      onEdit(user);
    },
    [onEdit]
  );

  const handleDelete = useCallback(
    (user: Types.User.UserType) => {
      onDelete(user);
    },
    [onDelete]
  );

  const fields: (keyof Types.User.UserType)[] = [
    "first_name",
    "last_name",
    "email",
    "role",
    "is_active",
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {fields.map((field) => (
            <TableHead
              key={field}
              onClick={() => handleSort(field)}
              className="cursor-pointer"
            >
              {t(`common.table.${field}`) || field}
              {sortKey === field && (sortDirection === "asc" ? " ▲" : " ▼")}
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
            <TableCell colSpan={6} className="text-center py-8">
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        ) : users.length > 0 ? (
          users.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                {user.is_active ? (
                  <Check className="text-green-500 inline-block" />
                ) : (
                  <X className="text-red-500 inline-block" />
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(user)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(user)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              {t("common.table.noData") || "No users found."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export const UserTable = memo(UserTableComponent);
