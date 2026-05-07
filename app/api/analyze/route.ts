import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { fetchPageText } from "@/lib/scraper";
import { buildPrompt } from "@/lib/prompt";
import { getAnthropicKey } from "@/lib/config";
import type { AnalyzeResponse, AnalysisResult } from "@/lib/types";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  const client = new Anthropic({ apiKey: getAnthropicKey() });
  try {
    const body = await req.json();
    let url: string = body.url?.trim() ?? "";

    if (!url) {
      return NextResponse.json({ error: "URL is required." }, { status: 400 });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return NextResponse.json({ error: "Invalid URL." }, { status: 400 });
    }

    const pageText = await fetchPageText(url);
    const prompt = buildPrompt(hostname, pageText);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("");

    const clean = raw.replace(/```json|```/g, "").trim();

    let parsed: AnalysisResult;
    try {
      parsed = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Could not parse Claude response as JSON.");
      parsed = JSON.parse(match[0]);
    }

    parsed.score = Math.min(10, Math.max(1, Math.round(parsed.score)));

    return NextResponse.json({ result: parsed, hostname });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
