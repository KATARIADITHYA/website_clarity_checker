import fs from "fs";
import path from "path";

function readEnvFile(): Record<string, string> {
  try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    const content = fs.readFileSync(envPath, "utf-8");
    const result: Record<string, string> = {};
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      result[key] = val;
    }
    return result;
  } catch {
    return {};
  }
}

export function getAnthropicKey(): string {
  // Try process.env first, then fall back to reading .env.local directly
  const fromEnv = process.env["ANTHROPIC_API_KEY"];
  if (fromEnv) return fromEnv;

  const fromFile = readEnvFile()["ANTHROPIC_API_KEY"];
  if (fromFile) return fromFile;

  throw new Error("ANTHROPIC_API_KEY is not set in .env.local");
}
