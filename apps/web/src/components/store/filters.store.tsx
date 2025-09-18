import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { memo, useCallback } from "react";
import { Types } from "@my-monorepo/shared";
interface FiltersType {
  search: string;
  company: string;
  admin: string;
  type: string;
  is_active: boolean | undefined;
  is_open: boolean | undefined;
  limit: number;
}

interface StoreFiltersProps {
  filters: FiltersType;
  setFilters: (updated: Partial<FiltersType>) => void;
  resetFilters: () => void;
  companies: Types.Company.CompanyType[];
  admins: Types.User.UserType[];
  storeTypes: string[];
}

export const StoreFilters = memo(function StoreFilters({
  filters,
  setFilters,
  resetFilters,
  companies,
  admins,
  storeTypes,
}: StoreFiltersProps) {
  const { t } = useTranslation();

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFilters({ search: e.target.value });
    },
    [setFilters]
  );

  const handleCompanyChange = useCallback(
    (val: string) => setFilters({ company: val === "all" ? "" : val }),
    [setFilters]
  );

  const handleAdminChange = useCallback(
    (val: string) => setFilters({ admin: val === "all" ? "" : val }),
    [setFilters]
  );

  const handleTypeChange = useCallback(
    (val: string) => setFilters({ type: val === "all" ? "" : val }),
    [setFilters]
  );

  const handleIsActiveChange = useCallback(
    (val: string) =>
      setFilters({
        is_active: val === "all" ? undefined : val === "active" ? true : false,
      }),
    [setFilters]
  );

  const handleIsOpenChange = useCallback(
    (val: string) =>
      setFilters({
        is_open: val === "all" ? undefined : val === "open" ? true : false,
      }),
    [setFilters]
  );

  const handleLimitChange = useCallback(
    (val: string) => setFilters({ limit: Number(val) }),
    [setFilters]
  );

  return (
    <div className="flex gap-4 flex-wrap">
      <Input
        placeholder={
          t("store.searchPlaceholder") || "Search by name or address"
        }
        value={filters.search}
        onChange={handleSearchChange}
      />

      <Select
        value={filters.company || "all"}
        onValueChange={handleCompanyChange}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue
            placeholder={t("common.form.label.company") || "Filter by company"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("common.form.select.allCompanies") || "All Companies"}
          </SelectItem>
          {companies.map((company) => (
            <SelectItem key={company._id} value={company._id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.admin || "all"} onValueChange={handleAdminChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={t("common.form.label.admin") || "Filter by admin"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("common.form.select.allAdmins") || "All Admins"}
          </SelectItem>
          {admins.map((admin) => (
            <SelectItem key={admin._id} value={admin._id}>
              {admin.first_name} {admin.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.type || "all"} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={t("common.form.label.type") || "Filter by type"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {t("common.form.select.allTypes") || "All Types"}
          </SelectItem>
          {storeTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
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
        onValueChange={handleIsActiveChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={t("common.form.label.status") || "Status"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.table.allStatus")}</SelectItem>
          <SelectItem value="active">{t("common.table.active")}</SelectItem>
          <SelectItem value="inactive">{t("common.table.inactive")}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          filters.is_open === undefined
            ? "all"
            : filters.is_open
            ? "open"
            : "closed"
        }
        onValueChange={handleIsOpenChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue
            placeholder={t("common.form.label.openStatus") || "Open Status"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("common.table.allStatus")}</SelectItem>
          <SelectItem value="open">
            {t("common.form.select.open") || "Open"}
          </SelectItem>
          <SelectItem value="closed">
            {t("common.form.select.closed") || "Closed"}
          </SelectItem>
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
});
