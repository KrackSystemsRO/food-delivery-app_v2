import { memo } from "react";
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

interface ProductTableProps {
  products: Types.Product.ProductType[];
  sortKey: keyof Types.Product.ProductType;
  sortDirection: "asc" | "desc";
  loading: boolean;
  onSort: (key: keyof Types.Product.ProductType) => void;
  onEdit: (product: Types.Product.ProductType) => void;
  onDelete: (product: Types.Product.ProductType) => void;
}

function ProductTableComponent({
  products,
  sortKey,
  sortDirection,
  loading,
  onSort,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const { t } = useTranslation();

  const columns: { key: keyof Types.Product.ProductType; label: string }[] = [
    { key: "name", label: t("common.table.name") || "Name" },
    { key: "category", label: t("common.table.category") || "Category" },
    { key: "price", label: t("common.table.price") || "Price" },
    { key: "is_active", label: t("common.table.is_active") || "Status" },
  ];

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
        {loading ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              <Loader2 className="animate-spin mx-auto h-6 w-6 text-gray-500" />
            </TableCell>
          </TableRow>
        ) : products.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              className="text-center py-8"
            >
              {t("common.table.noData") || "No products found."}
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {(Array.isArray(product.category) ? product.category : [])
                  .map((cat) => cat.name)
                  .join(", ") || "-"}
              </TableCell>
              <TableCell>{product.price.toFixed(2)}</TableCell>
              <TableCell>
                {product.is_active ? (
                  <Check className="text-green-500 inline-block" />
                ) : (
                  <X className="text-red-500 inline-block" />
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(product)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(product)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export const ProductTable = memo(ProductTableComponent);
