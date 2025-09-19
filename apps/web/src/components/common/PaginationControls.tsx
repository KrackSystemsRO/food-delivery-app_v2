import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
import { memo, useCallback, useMemo } from "react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls = memo(function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  const { t } = useTranslation();

  // Memoize callbacks
  const handlePrev = useCallback(
    () => onPageChange(page - 1),
    [page, onPageChange]
  );
  const handleNext = useCallback(
    () => onPageChange(page + 1),
    [page, onPageChange]
  );

  // Memoize static text
  const pageText = useMemo(
    () =>
      `${t("common.pagination.page")} ${page} ${t(
        "common.pagination.pageOf"
      )} ${totalPages}`,
    [t, page, totalPages]
  );

  return (
    <div className="flex justify-end items-center gap-2">
      <Button variant="outline" disabled={page <= 1} onClick={handlePrev}>
        {t("common.pagination.prev")}
      </Button>
      <span>{pageText}</span>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={handleNext}
      >
        {t("common.pagination.next")}
      </Button>
    </div>
  );
});
