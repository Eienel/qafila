// Shipment-tracking milestone status codes. The contract stores only a uint8;
// the label/icon live here so the chain stays cheap and the UI stays bilingual.
// Codes are append-only — never renumber an existing one.
export type MilestoneStatus = {
  code: number;
  key: string; // i18n key under messages `track.status`
  icon: string; // emoji glyph for the timeline node
};

export const MILESTONE_STATUSES: MilestoneStatus[] = [
  { code: 0, key: "booked", icon: "📝" },
  { code: 1, key: "pickedUp", icon: "📦" },
  { code: 2, key: "inTransit", icon: "🚢" },
  { code: 3, key: "atCustoms", icon: "🏛️" },
  { code: 4, key: "outForDelivery", icon: "🚚" },
  { code: 5, key: "delivered", icon: "✅" },
];

export function milestoneStatus(code: number): MilestoneStatus {
  return (
    MILESTONE_STATUSES.find((s) => s.code === code) ?? {
      code,
      key: "unknown",
      icon: "•",
    }
  );
}
