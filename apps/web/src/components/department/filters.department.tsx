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
import { useMemo } from "react";

interface FiltersType {
  search: string;
  is_active: boolean | undefined;
  limit: number;
  company?: string;
}

interface DepartmentFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
  companies: { _id: string; name: string }[];
}

export function DepartmentFilters({
  filters,
  setFilters,
  resetFilters,
  companies,
}: DepartmentFiltersProps) {
  const { t } = useTranslation();

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("common.table.allStatus") },
      { value: "active", label: t("common.table.active") },
      { value: "inactive", label: t("common.table.inactive") },
    ],
    [t]
  );

  const limitOptions = useMemo(() => ["10", "20", "50"], []);

  const FilterSelect = ({
    value,
    onChange,
    options,
    placeholder,
    width = "200px",
  }: {
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    width?: string;
  }) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[${width}]`}>
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
        placeholder={
          t("department.searchPlaceholder") ||
          "Search by name, company, or admin"
        }
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />

      <FilterSelect
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
            ? "active"
            : "inactive"
        }
        onChange={(val) =>
          setFilters({
            is_active: val === "all" ? undefined : val === "active",
          })
        }
        options={statusOptions}
        placeholder={t("department.filter.status") || "Filter by status"}
      />

      <FilterSelect
        value={filters.company || "all"}
        onChange={(val) => setFilters({ company: val === "all" ? "" : val })}
        options={[
          {
            value: "all",
            label: t("company.filter.allCompanies") || "All companies",
          },
          ...companies.map((c) => ({ value: c._id, label: c.name })),
        ]}
        placeholder={t("company.filter.company") || "Filter by company"}
      />

      <FilterSelect
        value={filters.limit.toString()}
        onChange={(val) => setFilters({ limit: Number(val) })}
        options={limitOptions.map((val) => ({ value: val, label: val }))}
        placeholder={t("common.pagination.itemsPerPage") || "Items per page"}
        width="120px"
      />

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
