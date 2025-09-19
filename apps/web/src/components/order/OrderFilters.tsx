import React, { useMemo, useCallback } from "react";
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

export interface FiltersType {
  search: string;
  status: string | undefined;
  limit: number;
}

interface OrderFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
}

export function OrderFilters({
  filters,
  setFilters,
  resetFilters,
}: OrderFiltersProps) {
  const { t } = useTranslation();

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t("common.table.allStatus") },
      { value: "pending", label: t("order.status.pending") },
      { value: "confirmed", label: t("order.status.confirmed") },
      { value: "delivered", label: t("order.status.delivered") },
      { value: "cancelled", label: t("order.status.cancelled") },
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
    (val: string) => setFilters({ status: val === "all" ? undefined : val }),
    [setFilters]
  );

  const handleLimitChange = useCallback(
    (val: string) => setFilters({ limit: Number(val) }),
    [setFilters]
  );

  const selectClass = "w-[200px]";

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder={t("order.searchPlaceholder") || "Search by customer"}
        value={filters.search}
        onChange={handleSearchChange}
      />

      <Select
        value={filters.status ?? "all"}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className={selectClass}>
          <SelectValue placeholder={t("order.filter.status")} />
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
