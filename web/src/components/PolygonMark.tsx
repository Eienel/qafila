// Polygon brand mark + wordmark, monochrome via currentColor so it sits on
// either surface. Real logo geometry, not decorative filler.
export function PolygonMark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className ?? ""}`}>
      <svg viewBox="0 0 38 34" className="h-full w-auto" fill="currentColor" aria-hidden>
        <path d="M28.4 11.1c-.7-.4-1.6-.4-2.4 0l-5.5 3.2-3.7 2.1-5.4 3.2c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V10c0-.8.4-1.6 1.2-2.1l4.3-2.4c.7-.4 1.6-.4 2.4 0L15.9 8c.7.4 1.2 1.2 1.2 2.1v3.2l3.7-2.2V7.9c0-.8-.4-1.6-1.2-2.1L11.5 1c-.7-.4-1.6-.4-2.4 0L1.2 5.8C.4 6.2 0 7 0 7.9v9.5c0 .8.4 1.6 1.2 2.1l7.9 4.6c.7.4 1.6.4 2.4 0l5.4-3.1 3.7-2.2 5.4-3.1c.7-.4 1.6-.4 2.4 0l4.3 2.4c.7.4 1.2 1.2 1.2 2.1v4.9c0 .8-.4 1.6-1.2 2.1l-4.3 2.5c-.7.4-1.6.4-2.4 0l-4.3-2.4c-.7-.4-1.2-1.2-1.2-2.1v-3.2l-3.7 2.2v3.2c0 .8.4 1.6 1.2 2.1l7.9 4.6c.7.4 1.6.4 2.4 0l7.9-4.6c.7-.4 1.2-1.2 1.2-2.1v-9.5c0-.8-.4-1.6-1.2-2.1l-8-4.6z" />
      </svg>
      <span className="font-medium">Polygon</span>
    </span>
  );
}
