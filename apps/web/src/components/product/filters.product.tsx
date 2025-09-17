import { memo, useMemo } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FiltersType {
  search: string;
  is_active: boolean | undefined;
  limit: number;
  category?: string;
  priceMin?: number;
  priceMax?: number;
}

interface ProductFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
  categories?: { value: string; label: string }[];
}

function ProductFiltersComponent({
  filters,
  setFilters,
  resetFilters,
  categories = [],
}: ProductFiltersProps) {
  const { t } = useTranslation();

  const statusMap: Record<string, boolean | undefined> = {
    all: undefined,
    active: true,
    inactive: false,
  };

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("common.table.allStatus") },
      { value: "active", label: t("common.table.active") },
      { value: "inactive", label: t("common.table.inactive") },
    ],
    [t]
  );

  const limitOptions = [10, 20, 50];

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder={t("product.searchPlaceholder") || "Search by name"}
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />

      <Select
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
            ? "active"
            : "inactive"
        }
        onValueChange={(val) => setFilters({ is_active: statusMap[val] })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("product.filter.status")} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {categories.length > 0 && (
        <Select
          value={filters.category || ""}
          onValueChange={(val) => setFilters({ category: val })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("product.filter.category")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("common.table.allCategories")}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Input
        type="number"
        placeholder={t("product.filter.priceMin") || "Min price"}
        value={filters.priceMin ?? ""}
        onChange={(e) =>
          setFilters({
            priceMin: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="w-[120px]"
      />
      <Input
        type="number"
        placeholder={t("product.filter.priceMax") || "Max price"}
        value={filters.priceMax ?? ""}
        onChange={(e) =>
          setFilters({
            priceMax: e.target.value ? Number(e.target.value) : undefined,
          })
        }
        className="w-[120px]"
      />

      <Select
        value={filters.limit.toString()}
        onValueChange={(val) => setFilters({ limit: Number(val) })}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={t("common.pagination.itemsPerPage")} />
        </SelectTrigger>
        <SelectContent>
          {limitOptions.map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex space-x-2">
        <Button
          onClick={resetFilters}
          variant="outline"
          title={t("common.button.resetFilters")}
        >
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}

export const ProductFilters = memo(ProductFiltersComponent);
