"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Coins, FileArrowUp, HandArrowDown } from "@phosphor-icons/react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Step = { title: string; body: string };

// The lifecycle as a lit path: three lantern nodes glowing on in sequence,
// connected by a travelling gold line. Motivated: mirrors the fund -> prove ->
// release narrative in the order the user reads it.
export function StepFlow({ steps }: { steps: Step[] }) {
  const reduce = useReducedMotion();
  const icons = [Coins, FileArrowUp, HandArrowDown];

  return (
    <motion.ol
      className="grid gap-10 md:grid-cols-3"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.25 } } }}
    >
      {steps.map((s, i) => {
        const Icon = icons[i];
        return (
          <motion.li
            key={i}
            className="relative"
            variants={{
              hidden: reduce ? {} : { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {/* connector line to next node */}
            {i < steps.length - 1 && (
              <div className="absolute left-[3.25rem] top-8 hidden h-px w-[calc(100%-2rem)] bg-gold/20 md:block">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.25, ease: EASE }}
                  style={{ originX: 0 }}
                />
              </div>
            )}
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/25 bg-night-2 shadow-lantern-sm">
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-gold-glow/20 blur-md"
                animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4 }}
              />
              <Icon weight="light" className="relative h-7 w-7 text-gold-glow" />
            </div>
            <h3 className="font-display text-2xl text-mist">{s.title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-mist-dim">{s.body}</p>
          </motion.li>
        );
      })}
    </motion.ol>
  );
}
