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
import { useMemo, useCallback } from "react";

interface FiltersType {
  search: string;
  is_active: boolean | undefined;
  limit: number;
}

interface IngredientFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
}

export function IngredientFilters({
  filters,
  setFilters,
  resetFilters,
}: IngredientFiltersProps) {
  const { t } = useTranslation();

  const statusMap = useMemo(
    () => ({
      all: undefined,
      active: true,
      inactive: false,
    }),
    []
  );

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("common.table.allStatus") },
      { value: "active", label: t("common.table.active") },
      { value: "inactive", label: t("common.table.inactive") },
    ],
    [t]
  );

  const limitOptions = useMemo(() => [10, 20, 50], []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters]
  );

  const handleStatusChange = useCallback(
    (val: keyof typeof statusMap) => {
      setFilters({ is_active: statusMap[val] });
    },
    [setFilters, statusMap]
  );

  const handleLimitChange = useCallback(
    (val: string) => {
      setFilters({ limit: Number(val) });
    },
    [setFilters]
  );

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder={t("ingredient.searchPlaceholder") || "Search by name"}
        value={filters.search}
        onChange={handleSearchChange}
      />

      <Select
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
            ? "active"
            : "inactive"
        }
        onValueChange={(val) =>
          handleStatusChange(val as keyof typeof statusMap)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("ingredient.filter.status")} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.limit.toString()}
        onValueChange={handleLimitChange}
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

      <Button
        onClick={resetFilters}
        variant="outline"
        title={t("common.button.resetFilters")}
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
