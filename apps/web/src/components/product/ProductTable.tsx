import { memo, useMemo } from "react";
import { DataTable, type ColumnDef } from "@/components/common/DataTable";
import type { Types } from "@my-monorepo/shared";

interface ProductTableProps {
  products: Types.Product.ProductType[];
  loading: boolean;
  sortKey: keyof Types.Product.ProductType;
  sortDirection: "asc" | "desc";
  onSort: (key: keyof Types.Product.ProductType) => void;
  onEdit: (product: Types.Product.ProductType) => void;
  onDelete: (product: Types.Product.ProductType) => void;
  t: (key: string) => string;
}

function ProductTableComponent({
  products,
  loading,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  t,
}: ProductTableProps) {
  const columns: ColumnDef<Types.Product.ProductType>[] = useMemo(
    () => [
      { key: "name", label: t("product.name") || "Name" },
      {
        key: "price",
        label: t("product.price") || "Price",
        render: (p) => `$${p.price.toFixed(2)}`,
      },
      {
        key: "is_active",
        label: t("product.active") || "Active",
        render: (p) => (p.is_active ? "Yes" : "No"),
      },
      {
        key: "category",
        label: t("product.category") || "Category",
        render: (p) => p.category?.map((c) => c.name).join(", ") || "-",
      },
    ],
    [t]
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      sortKey={sortKey}
      sortDirection={sortDirection}
      loading={loading}
      onSort={onSort}
      onEdit={onEdit}
      onDelete={onDelete}
      noDataText={t("product.noProducts") || "No products found."}
    />
  );
}

export const ProductTable = memo(
  ProductTableComponent,
  (prev, next) =>
    prev.products === next.products &&
    prev.loading === next.loading &&
    prev.sortKey === next.sortKey &&
    prev.sortDirection === next.sortDirection
);
