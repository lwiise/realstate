"use client";

import { useState } from "react";
import { Languages, Loader2, PlugZap } from "lucide-react";
import { testGeminiAction, translatePendingBatchAction } from "@/app/admin/actions";

interface TranslationRunnerProps {
  initialPending: number;
  geminiConfigured: boolean;
  model: string;
}

// Drives "translate everything" by calling the batched server action in a loop, and
// exposes a "test connection" so the EXACT Gemini error is visible in the admin.
export function TranslationRunner({ initialPending, geminiConfigured, model }: TranslationRunnerProps) {
  const [running, setRunning] = useState(false);
  const [translated, setTranslated] = useState(0);
  const [failed, setFailed] = useState(0);
  const [remaining, setRemaining] = useState(initialPending);
  const [message, setMessage] = useState("");
  const [errorDetail, setErrorDetail] = useState("");
  const [done, setDone] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; sample?: string; error?: string } | null>(null);

  const runTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testGeminiAction();
      setTestResult({ ok: result.ok, sample: result.sample, error: result.error });
    } catch {
      setTestResult({ ok: false, error: "Impossible d'exécuter le test (erreur serveur)." });
    } finally {
      setTesting(false);
    }
  };

  const run = async () => {
    setRunning(true);
    setMessage("");
    setErrorDetail("");
    setTranslated(0);
    setFailed(0);
    setDone(false);
    try {
      let guard = 300; // safety cap on loop iterations
      while (guard-- > 0) {
        const result = await translatePendingBatchAction();
        if (result.error) setErrorDetail(result.error);
        if (!result.geminiConfigured) {
          setMessage("La clé Gemini (google_api) n'est pas configurée sur le serveur.");
          break;
        }
        setTranslated((value) => value + result.translatedNow);
        setFailed((value) => value + result.failed);
        setRemaining(result.remaining);
        if (result.remaining <= 0) {
          setDone(true);
          setMessage("Tout le contenu a été traduit en anglais.");
          break;
        }
        if (result.translatedNow === 0) {
          setMessage("Arrêté : les traductions ont échoué. Voir le détail ci-dessous.");
          break;
        }
      }
    } catch {
      setMessage("Une erreur est survenue pendant la traduction.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      {/* Connection test */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-sm font-medium text-foreground">Connexion à l&apos;IA de traduction (OpenRouter)</p>
          <p className="text-xs text-muted-foreground">
            Clé : {geminiConfigured ? "détectée ✓" : "non détectée ✗"} · Modèle :{" "}
            <span className="font-mono">{model}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={runTest}
          disabled={testing}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-gold disabled:opacity-50"
        >
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
          Tester la connexion
        </button>
      </div>

      {testResult ? (
        testResult.ok ? (
          <p className="text-sm text-emerald-600">✓ Connexion réussie. Exemple : « {testResult.sample} »</p>
        ) : (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <p className="font-medium">Échec de la connexion :</p>
            <p className="mt-1 break-words font-mono text-xs">{testResult.error}</p>
          </div>
        )
      ) : null}

      {/* Translate all */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Générer les traductions anglaises manquantes</p>
          <p className="text-xs text-muted-foreground">
            {running
              ? `Traduction en cours… ${translated} traduites, ${remaining} restantes`
              : `${remaining} élément(s) à traduire`}
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={running || !geminiConfigured}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          {running ? "Traduction…" : "Tout traduire en anglais"}
        </button>
      </div>

      {!geminiConfigured ? (
        <p className="text-xs text-amber-600">
          La clé <code className="font-mono">google_api</code> n&apos;est pas détectée sur le serveur.
          Ajoutez-la (Netlify pour le site en ligne, ou <code className="font-mono">.env.local</code> en local),
          redéployez, puis rechargez cette page.
        </p>
      ) : null}
      {failed > 0 ? <p className="text-xs text-amber-600">{failed} élément(s) ont échoué.</p> : null}
      {message ? (
        <p className={`text-sm ${done ? "text-emerald-600" : "text-muted-foreground"}`}>{message}</p>
      ) : null}
      {errorDetail ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p className="font-medium">Détail de l&apos;erreur :</p>
          <p className="mt-1 break-words font-mono text-xs">{errorDetail}</p>
        </div>
      ) : null}
    </div>
  );
}
