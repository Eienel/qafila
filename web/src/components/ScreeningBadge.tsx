"use client";

import { useTranslations } from "next-intl";
import type { ScreeningVerdict } from "@/lib/screening";

export function ScreeningBadge({
  result,
  loading,
}: {
  result?: ScreeningVerdict;
  loading?: boolean;
}) {
  const t = useTranslations("screening");
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-text-dim/40 px-3 py-1 text-xs text-text-dim">
        <span className="h-2 w-2 animate-pulse rounded-full bg-text-dim" />
        {t("checking")}
      </span>
    );
  }
  if (!result) return null;
  const clear = result.verdict === "clear";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
        clear ? "border-success/60 text-success" : "border-danger/60 text-danger"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${clear ? "bg-success" : "bg-danger"}`} />
      {clear ? t("clear") : t("review")}
    </span>
  );
}
