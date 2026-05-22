"use client";

import { useState } from "react";
import { Languages, Loader2 } from "lucide-react";
import { translatePendingBatchAction } from "@/app/admin/actions";

interface TranslationRunnerProps {
  initialPending: number;
  geminiConfigured: boolean;
}

// Drives "translate everything" by calling the batched server action in a loop until
// nothing remains. Each call translates a few items server-side (within time limits).
export function TranslationRunner({ initialPending, geminiConfigured }: TranslationRunnerProps) {
  const [running, setRunning] = useState(false);
  const [translated, setTranslated] = useState(0);
  const [failed, setFailed] = useState(0);
  const [remaining, setRemaining] = useState(initialPending);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  const run = async () => {
    setRunning(true);
    setMessage("");
    setTranslated(0);
    setFailed(0);
    setDone(false);
    try {
      let guard = 300; // safety cap on loop iterations
      while (guard-- > 0) {
        const result = await translatePendingBatchAction();
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
          setMessage("Arrêté : certaines traductions ont échoué. Réessayez dans un moment.");
          break;
        }
      }
    } catch {
      setMessage("Une erreur est survenue pendant la traduction.");
    } finally {
      setRunning(false);
    }
  };

  if (!geminiConfigured) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        La traduction automatique est désactivée : la variable d&apos;environnement{" "}
        <code className="font-mono">google_api</code> (clé Gemini) n&apos;est pas définie sur le serveur.
        Ajoutez-la dans Netlify, redéployez, puis rechargez cette page.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-6">
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
          disabled={running}
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          {running ? "Traduction…" : "Tout traduire en anglais"}
        </button>
      </div>
      {failed > 0 ? (
        <p className="text-xs text-amber-600">
          {failed} élément(s) ont échoué et seront réessayés au prochain lancement.
        </p>
      ) : null}
      {message ? (
        <p className={`text-sm ${done ? "text-emerald-600" : "text-muted-foreground"}`}>{message}</p>
      ) : null}
    </div>
  );
}
