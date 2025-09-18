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
interface DepartmentTableProps {
  departments: Types.Department.DepartmentType[];
  sortKey: keyof Types.Department.DepartmentType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof Types.Department.DepartmentType) => void;
  onEdit: (department: Types.Department.DepartmentType) => void;
  onDelete: (department: Types.Department.DepartmentType) => void;
}

export function DepartmentTable({
  departments,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: DepartmentTableProps) {
  const { t } = useTranslation();

  const columns: {
    key: keyof Types.Department.DepartmentType;
    label: string;
  }[] = [
    { key: "name", label: t("common.table.name", "Name") },
    { key: "company", label: t("common.table.company", "Company") },
    { key: "admin", label: t("common.table.admin", "Admins") },
    { key: "is_active", label: t("common.table.is_active", "Status") },
  ];

  const renderList = <
    T extends { name?: string; first_name?: string; last_name?: string }
  >(
    items?: T[],
    type: "company" | "admin" = "company"
  ) => {
    if (!items || items.length === 0) return "-";
    return items
      .map((i) =>
        type === "company"
          ? i.name
          : `${i.first_name || ""} ${i.last_name || ""}`.trim()
      )
      .join(", ");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map(({ key, label }) => (
            <TableHead
              key={key}
              onClick={() => onSort(key)}
              className="cursor-pointer select-none"
              aria-sort={
                sortKey === key
                  ? sortDirection === "asc"
                    ? "ascending"
                    : "descending"
                  : undefined
              }
            >
              {label}
              {sortKey === key && (sortDirection === "asc" ? " ▲" : " ▼")}
            </TableHead>
          ))}
          <TableHead className="text-right">
            {t("common.table.actions", "Actions")}
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
        ) : departments.length > 0 ? (
          departments.map((dept) => (
            <TableRow key={dept._id}>
              <TableCell>{dept.name}</TableCell>
              <TableCell>{renderList(dept.company, "company")}</TableCell>
              <TableCell>{renderList(dept.admin, "admin")}</TableCell>
              <TableCell className="text-center">
                {dept.is_active ? (
                  <Check className="text-green-500 inline-block" />
                ) : (
                  <X className="text-red-500 inline-block" />
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(dept)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(dept)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData", "No departments found.")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
