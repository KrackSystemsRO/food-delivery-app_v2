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
import type { StoreType } from "@/types/store.type";
import { memo, useCallback } from "react";

interface StoreTableProps {
  stores: StoreType[];
  sortKey: keyof StoreType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof StoreType) => void;
  onEdit: (store: StoreType) => void;
  onDelete: (store: StoreType) => void;
}

const TABLE_COLUMNS: (
  | keyof StoreType
  | "company"
  | "admin"
  | "is_active"
  | "is_open"
)[] = ["name", "type", "address", "company", "admin", "is_active", "is_open"];

export const StoreTable = memo(function StoreTable({
  stores,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: StoreTableProps) {
  const { t } = useTranslation();

  const renderCompanies = useCallback((companies: StoreType["company"]) => {
    if (!companies || companies.length === 0) return "-";
    return companies.map((c) => c.name).join(", ");
  }, []);

  const renderAdmins = useCallback((admins: StoreType["admin"]) => {
    if (!admins || admins.length === 0) return "-";
    return admins.map((a) => `${a.first_name} ${a.last_name}`).join(", ");
  }, []);

  const StoreRow = memo(({ store }: { store: StoreType }) => (
    <TableRow key={store._id}>
      <TableCell>{store.name}</TableCell>
      <TableCell>{store.type}</TableCell>
      <TableCell>{store.address}</TableCell>
      <TableCell>{renderCompanies(store.company)}</TableCell>
      <TableCell>{renderAdmins(store.admin)}</TableCell>
      <TableCell>
        {store.is_active ? (
          <Check className="text-green-500 inline-block" />
        ) : (
          <X className="text-red-500 inline-block" />
        )}
      </TableCell>
      <TableCell>
        {store.is_open ? (
          <Check className="text-green-500 inline-block" />
        ) : (
          <X className="text-red-500 inline-block" />
        )}
      </TableCell>
      <TableCell className="text-right space-x-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(store)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(store)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  ));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {TABLE_COLUMNS.map((field) => (
            <TableHead
              key={field}
              onClick={() => onSort(field as keyof StoreType)}
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
            <TableCell colSpan={8} className="text-center py-8">
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        ) : stores.length > 0 ? (
          stores.map((store) => <StoreRow key={store._id} store={store} />)
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              {t("common.table.noData") || "No stores found."}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
},
areEqual);

function areEqual(prevProps: StoreTableProps, nextProps: StoreTableProps) {
  return (
    prevProps.stores === nextProps.stores &&
    prevProps.sortKey === nextProps.sortKey &&
    prevProps.sortDirection === nextProps.sortDirection &&
    prevProps.loading === nextProps.loading &&
    prevProps.onSort === nextProps.onSort &&
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );
}
