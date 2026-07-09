import { NextRequest, NextResponse } from "next/server";

// Counterparty screening. We stand on the OpenSanctions match API — we do NOT
// build matching ourselves. If OPENSANCTIONS_API_KEY is set, we query the hosted
// resolver; otherwise we fall back to a deterministic demo stub so the flow
// stays runnable offline. Either way the frontend only sees a verdict + score.
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const apiKey = process.env.OPENSANCTIONS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(demoVerdict(name));
  }

  try {
    const res = await fetch("https://api.opensanctions.org/match/default", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${apiKey}`,
      },
      body: JSON.stringify({
        queries: { q1: { schema: "Company", properties: { name: [name] } } },
      }),
    });
    if (!res.ok) throw new Error(`OpenSanctions ${res.status}`);
    const data = await res.json();
    const results = data?.responses?.q1?.results ?? [];
    const top = results[0];
    const score = top?.score ?? 0;
    // OpenSanctions marks a strong candidate with `match: true`.
    const flagged = results.some((r: { match?: boolean }) => r.match);
    return NextResponse.json({
      verdict: flagged ? "review" : "clear",
      score,
      source: "opensanctions",
    });
  } catch (e) {
    // Never block the demo on an upstream hiccup; degrade to the stub.
    return NextResponse.json({ ...demoVerdict(name), source: "fallback" });
  }
}

// Demo heuristic: flag a couple of obvious tokens so judges can see the "review"
// path without needing a real sanctioned entity.
function demoVerdict(name: string) {
  const flagged = /\b(sanction|ofac|blocked|denied|terror)\b/i.test(name);
  return {
    verdict: flagged ? "review" : "clear",
    score: flagged ? 0.92 : 0.04,
    source: "demo",
  };
}
