// =============================================================================
// AI translation client — ALL translation API calls live here.
// Uses OpenRouter (https://openrouter.ai), an OpenAI-compatible gateway, so the
// model is easily swappable. SERVER-ONLY: imported only by server actions, route
// handlers, and CLI scripts. Never import from a "use client" component / public page.
//
// The API key is read from process.env.google_api (the existing Netlify variable —
// it holds an OpenRouter key) and sent only in the Authorization header, never in a
// URL, log, or response. Override the model with OPENROUTER_MODEL.
// =============================================================================

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// Default model: strong, fast, low-cost multilingual translation. Override via
// OPENROUTER_MODEL — e.g. "openai/gpt-4o" or "anthropic/claude-sonnet-4" for a
// different quality/cost trade-off (any OpenRouter "provider/model" slug works).
const DEFAULT_MODEL = "google/gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 30_000;

const SYSTEM_PROMPT = [
  "You are a professional translator for a luxury real estate brand.",
  "Translate the JSON values provided by the user from French to English.",
  "Keep the meaning accurate, natural, professional, and suitable for a luxury real estate website.",
  "Preserve formatting and structure (paragraphs, line breaks, bullet points).",
  "Do not translate brand names, project names, developer names, addresses, URLs, emails, phone numbers, slugs, IDs, or code-like values.",
  "Return ONLY a JSON object using the exact same keys as the input; translate only the string values.",
].join(" ");

// The key is documented as `google_api`; also accept common aliases. Tolerate stray
// surrounding quotes / whitespace that are easy to paste into an env var by mistake.
function resolveApiKey(): string | undefined {
  const raw =
    process.env.google_api ??
    process.env.OPENROUTER_API_KEY ??
    process.env.GOOGLE_API ??
    process.env.GEMINI_API_KEY;
  if (!raw) return undefined;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").trim();
  return cleaned || undefined;
}

function resolveModel(): string {
  return process.env.OPENROUTER_MODEL?.trim() || process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function getGeminiModel(): string {
  return resolveModel();
}

export function isGeminiConfigured(): boolean {
  return Boolean(resolveApiKey());
}

class TranslateError extends Error {}

/** Extract a JSON object from the model output (strips ``` fences / surrounding prose). */
function extractJsonObject(text: string): string {
  let value = text.trim();
  if (value.startsWith("```")) {
    value = value.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  if (value.startsWith("{")) return value;
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");
  if (start !== -1 && end > start) return value.slice(start, end + 1);
  return value;
}

/**
 * Translate a JSON object of French field values to English via OpenRouter.
 * Input/output share the exact same keys; only string values change.
 * Throws on missing key, network error, timeout, non-200, or unparseable output —
 * callers (translation-service) catch this and mark the entity "needs_translation".
 */
export async function translateJsonFrToEn(
  fields: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new TranslateError("No translation API key found (set the google_api environment variable).");
  }

  // Nothing translatable -> return as-is, no API call.
  if (!fields || Object.keys(fields).length === 0) {
    return {};
  }

  const model = resolveModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "X-Title": "MDK Immobilier",
    };
    // Optional attribution header recommended by OpenRouter.
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      headers["HTTP-Referer"] = process.env.NEXT_PUBLIC_SITE_URL;
    }

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Input JSON:\n${JSON.stringify(fields)}` },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new TranslateError(`OpenRouter API returned ${response.status}: ${detail.slice(0, 600)}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message?: string };
    };
    if (data.error?.message) {
      throw new TranslateError(`OpenRouter error: ${data.error.message}`);
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      throw new TranslateError("OpenRouter returned an empty response.");
    }

    const parsed = JSON.parse(extractJsonObject(text));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new TranslateError("Translation did not return a JSON object.");
    }
    return parsed as Record<string, unknown>;
  } finally {
    clearTimeout(timeout);
  }
}

export interface GeminiTestResult {
  ok: boolean;
  model: string;
  sample?: string;
  error?: string;
}

/**
 * Performs a single tiny translation to verify the key/model/connection.
 * Never throws — returns the exact error string so the admin UI can show what's wrong.
 */
export async function testGeminiConnection(): Promise<GeminiTestResult> {
  const model = resolveModel();
  if (!resolveApiKey()) {
    return { ok: false, model, error: "Aucune clé API détectée (variable google_api)." };
  }
  try {
    const result = await translateJsonFrToEn({ greeting: "Bonjour, bienvenue chez MDK Immobilier" });
    const sample = typeof result.greeting === "string" ? result.greeting : JSON.stringify(result);
    return { ok: true, model, sample };
  } catch (error) {
    return { ok: false, model, error: error instanceof Error ? error.message : String(error) };
  }
}
