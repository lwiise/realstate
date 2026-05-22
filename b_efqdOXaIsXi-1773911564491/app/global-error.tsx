"use client";

import { useEffect } from "react";

// global-error replaces the root layout, so it must render its own <html>/<body>
// and cannot rely on the app's CSS/fonts being loaded — use inline styles only.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#ffffff",
          color: "#1a1a1a",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <p
            style={{
              color: "#d4af37",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: 13,
              margin: "0 0 16px",
            }}
          >
            Erreur / Error
          </p>
          <h1 style={{ fontSize: 32, lineHeight: 1.2, margin: "0 0 16px" }}>
            Une erreur est survenue
          </h1>
          <p style={{ color: "#666", margin: "0 0 32px" }}>
            Une erreur inattendue s&apos;est produite. Veuillez reessayer.
            <br />
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-block",
              background: "#111111",
              color: "#ffffff",
              border: "none",
              padding: "14px 32px",
              fontSize: 13,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Reessayer / Try again
          </button>
        </div>
      </body>
    </html>
  );
}
