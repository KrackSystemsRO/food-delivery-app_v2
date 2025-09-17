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
  type: string;
  is_active: boolean | undefined;
  limit: number;
}

interface CompanyFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
}

export function CompanyFilters({
  filters,
  setFilters,
  resetFilters,
}: CompanyFiltersProps) {
  const { t } = useTranslation();

  const typeOptions = [
    { value: "all", label: t("company.type.allTypes", "All Types") },
    { value: "CLIENT", label: t("company.type.client", "Client") },
    { value: "PROVIDER", label: t("company.type.provider", "Provider") },
  ];

  const statusOptions = [
    { value: "all", label: t("common.table.allStatus", "All") },
    { value: "active", label: t("common.table.active", "Active") },
    { value: "inactive", label: t("common.table.inactive", "Inactive") },
  ];

  const statusMap: Record<string, boolean | undefined> = {
    all: undefined,
    active: true,
    inactive: false,
  };

  const limitOptions = [10, 20, 50];

  const renderSelect = (
    value: string,
    onChange: (val: string) => void,
    placeholder: string,
    options: { value: string; label: string }[],
    width: string
  ) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={width}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder={t("company.searchPlaceholder", "Search by name or admin")}
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />

      {renderSelect(
        filters.type || "all",
        (val) => setFilters({ type: val === "all" ? "" : val }),
        t("company.filter.type", "Type"),
        typeOptions,
        "w-[200px]"
      )}

      {renderSelect(
        filters.is_active === undefined
          ? "all"
          : filters.is_active
          ? "active"
          : "inactive",
        (val) => setFilters({ is_active: statusMap[val] }),
        t("company.filter.status", "Status"),
        statusOptions,
        "w-[200px]"
      )}

      {renderSelect(
        filters.limit.toString(),
        (val) => setFilters({ limit: Number(val) }),
        t("common.pagination.itemsPerPage", "Items per page"),
        limitOptions.map((num) => ({
          value: num.toString(),
          label: num.toString(),
        })),
        "w-[120px]"
      )}

      <Button
        onClick={resetFilters}
        variant="outline"
        title={t("common.button.resetFilters", "Reset Filters")}
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
