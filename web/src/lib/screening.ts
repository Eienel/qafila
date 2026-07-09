export type ScreeningVerdict = {
  verdict: "clear" | "review";
  score: number;
  source: string;
};

export async function screenCounterparty(
  name: string
): Promise<ScreeningVerdict> {
  const res = await fetch("/api/screen", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("screening failed");
  return res.json();
}
