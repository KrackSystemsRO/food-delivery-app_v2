import React, { memo, useCallback } from "react";
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
  role: string;
  is_active: boolean | undefined;
  limit: number;
}

interface UserFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
}

function UserFiltersComponent({
  filters,
  setFilters,
  resetFilters,
}: UserFiltersProps) {
  const { t } = useTranslation();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters]
  );

  const handleRoleChange = useCallback(
    (val: string) => {
      setFilters({ role: val === "all" ? "" : val });
    },
    [setFilters]
  );

  const handleStatusChange = useCallback(
    (val: string) => {
      setFilters({
        is_active: val === "all" ? undefined : val === "active" ? true : false,
      });
    },
    [setFilters]
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
        placeholder={t("user.searchPlaceholder") || "Search by name or email"}
        value={filters.search}
        onChange={handleSearchChange}
      />

      <Select value={filters.role || "all"} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("user.filter.role")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("role.allRoles")}</SelectItem>
          <SelectItem value="ADMIN">{t("role.admin")}</SelectItem>
          <SelectItem value="MANAGER_RESTAURANT">
            {t("role.managerRestaurant")}
          </SelectItem>
          <SelectItem value="CLIENT">{t("role.client")}</SelectItem>
          <SelectItem value="COURIER">{t("role.courier")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          filters.is_active === undefined
            ? "all"
            : filters.is_active
            ? "active"
            : "inactive"
        }
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("user.filter.status")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.table.allStatus")}</SelectItem>
          <SelectItem value="active">{t("common.table.active")}</SelectItem>
          <SelectItem value="inactive">{t("common.table.inactive")}</SelectItem>
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
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex space-x-2">
        <Button onClick={resetFilters} variant="outline">
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}

export const UserFilters = memo(UserFiltersComponent);
