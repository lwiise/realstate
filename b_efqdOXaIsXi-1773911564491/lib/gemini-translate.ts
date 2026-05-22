// =============================================================================
// Gemini translation client — ALL Gemini API calls live in this file.
// SERVER-ONLY: imported only by server actions, route handlers, and CLI scripts.
// Never import this from a "use client" component or a public page.
// The API key is read from process.env.google_api (Netlify env var) and is sent
// only in the x-goog-api-key request header — never in a URL, log, or response.
// =============================================================================

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 20_000;

// Exact instruction requested for the luxury real-estate use case.
const TRANSLATION_PROMPT = [
  "Translate the following website/admin content from French to English.",
  "Keep the meaning accurate, natural, professional, and suitable for a luxury real estate website.",
  "Preserve formatting and structure (paragraphs, line breaks, bullet points).",
  "Do not translate brand names, project names, developer names, addresses, URLs, emails, phone numbers, slugs, IDs, or code-like values.",
  "Return JSON only using the exact same keys as the input. Translate only the string values.",
].join("\n");

// The key is documented as `google_api` (Netlify), but accept the common variants too
// so a casing/name mismatch doesn't silently disable translation.
function resolveApiKey(): string | undefined {
  const raw = process.env.google_api ?? process.env.GOOGLE_API ?? process.env.GEMINI_API_KEY;
  return raw && raw.trim() ? raw.trim() : undefined;
}

function resolveModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

export function getGeminiModel(): string {
  return resolveModel();
}

export function isGeminiConfigured(): boolean {
  return Boolean(resolveApiKey());
}

class GeminiError extends Error {}

/** Strip an accidental ```json ... ``` markdown fence if the model adds one. */
function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }
  return trimmed;
}

/**
 * Translate a JSON object of French field values to English.
 * Input/output share the exact same keys; only string values change.
 * Throws on missing key, network error, timeout, non-200, or unparseable output —
 * callers (translation-service) catch this and mark the entity "needs_translation".
 */
export async function translateJsonFrToEn(
  fields: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new GeminiError("No Gemini API key found (set the google_api environment variable).");
  }

  // Nothing translatable -> return as-is, no API call.
  if (!fields || Object.keys(fields).length === 0) {
    return {};
  }

  const model = resolveModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${TRANSLATION_PROMPT}\n\nInput JSON:\n${JSON.stringify(fields)}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          maxOutputTokens: 8192,
        },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // Read body for server-side logging context, but never surface the key.
      const detail = await response.text().catch(() => "");
      throw new GeminiError(`Gemini API returned ${response.status}: ${detail.slice(0, 500)}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new GeminiError("Gemini API returned an empty response.");
    }

    const parsed = JSON.parse(stripCodeFence(text));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new GeminiError("Gemini did not return a JSON object.");
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
    return { ok: false, model, error: "Aucune clé API Gemini détectée (variable google_api)." };
  }
  try {
    const result = await translateJsonFrToEn({ greeting: "Bonjour, bienvenue chez MDK Immobilier" });
    const sample = typeof result.greeting === "string" ? result.greeting : JSON.stringify(result);
    return { ok: true, model, sample };
  } catch (error) {
    return { ok: false, model, error: error instanceof Error ? error.message : String(error) };
  }
}
