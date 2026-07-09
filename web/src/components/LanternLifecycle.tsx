"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { EscrowState } from "@/contracts";

// Ordered lifecycle for the happy path; side states (Refunded/Disputed) are
// annotated separately.
const FLOW: EscrowState[] = ["Created", "Funded", "Shipped", "Released"];

export function LanternLifecycle({
  state,
  size = "md",
}: {
  state: EscrowState;
  size?: "sm" | "md";
}) {
  const t = useTranslations("lifecycle");
  const activeIndex = FLOW.indexOf(state);
  const isReleased = state === "Released";
  const isSide = state === "Refunded" || state === "Disputed";
  const litFrom = isSide ? 1 : activeIndex; // Funded onward the lantern is lit

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {FLOW.map((s, i) => {
          const lit = i <= litFrom && litFrom >= 1;
          const done = i < activeIndex || (isReleased && i <= activeIndex);
          return (
            <div key={s} className="flex flex-1 items-center">
              <LanternNode
                lit={lit}
                released={isReleased && s === "Released"}
                dim={isSide}
                size={size}
              />
              {i < FLOW.length - 1 && (
                <div className="relative mx-1 h-px flex-1 bg-[rgba(212,175,55,0.18)]">
                  {done && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gold"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-text-dim">
        {FLOW.map((s) => (
          <span key={s} className="flex-1 text-center first:text-start last:text-end">
            {t(s as any)}
          </span>
        ))}
      </div>
      {isSide && (
        <p className="mt-3 text-center text-xs text-danger">
          {state === "Refunded" ? t("Refunded") : t("Disputed")}
        </p>
      )}
    </div>
  );
}

function LanternNode({
  lit,
  released,
  dim,
  size,
}: {
  lit: boolean;
  released: boolean;
  dim: boolean;
  size: "sm" | "md";
}) {
  const dim_px = size === "sm" ? 20 : 28;
  return (
    <div className="relative flex items-center justify-center" style={{ width: dim_px + 8 }}>
      {lit && !dim && (
        <motion.span
          aria-hidden
          className="absolute rounded-full bg-gold-glow blur-md"
          style={{ width: dim_px, height: dim_px }}
          animate={{ opacity: released ? [0.5, 0.9, 0.5] : [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}
      <svg width={dim_px} height={dim_px} viewBox="0 0 24 24" className="relative">
        <path
          d="M8 4 H16 L14 20 H10 Z"
          fill={lit && !dim ? (released ? "#2FB380" : "url(#node-glow)") : "#1C1C1F"}
          stroke={lit && !dim ? (released ? "#2FB380" : "#D4AF37") : "rgba(212,175,55,0.35)"}
          strokeWidth="1.2"
        />
        <defs>
          <radialGradient id="node-glow" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#F1D48A" />
            <stop offset="100%" stopColor="#A67C1A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
