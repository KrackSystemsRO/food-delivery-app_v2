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
import type { CompanyType } from "@/types/company.type";

interface CompanyTableProps {
  companies: CompanyType[];
  sortKey: keyof CompanyType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof CompanyType) => void;
  onEdit: (company: CompanyType) => void;
  onDelete: (company: CompanyType) => void;
}

export function CompanyTable({
  companies,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: CompanyTableProps) {
  const { t } = useTranslation();

  const columns = [
    { key: "name" as const, label: t("common.table.name", "Name") },
    { key: "type" as const, label: t("common.table.type", "Type") },
    { key: "admin" as const, label: t("common.table.admin", "Admins") },
    { key: "is_active" as const, label: t("common.table.is_active", "Status") },
  ];

  const renderAdmins = (admins: CompanyType["admin"]) =>
    admins?.length
      ? admins.map((a) => `${a.first_name} ${a.last_name}`).join(", ")
      : "-";

  if (loading) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  if (!companies.length) {
    return (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData", "No companies found.")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.key}
              onClick={() => onSort(col.key)}
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
        {companies.map((company) => (
          <TableRow key={company._id}>
            <TableCell>{company.name}</TableCell>
            <TableCell>{company.type}</TableCell>
            <TableCell>{renderAdmins(company.admin)}</TableCell>
            <TableCell>
              {company.is_active ? (
                <Check className="text-green-500 inline-block" />
              ) : (
                <X className="text-red-500 inline-block" />
              )}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(company)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(company)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
