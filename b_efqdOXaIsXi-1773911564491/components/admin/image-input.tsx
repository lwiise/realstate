"use client";

import { useRef, useState, useTransition } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import type { MediaAsset } from "@/lib/cms-types";

interface ImageInputProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  library?: MediaAsset[];
  helpText?: string;
}

export function ImageInput({
  name,
  label,
  defaultValue,
  library = [],
  helpText,
}: ImageInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isPending, startTransition] = useTransition();
  const [showLibrary, setShowLibrary] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = (file: File | null) => {
    if (!file) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { url: string };
      setValue(payload.url);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-gold"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Téléverser
          </button>
          {library.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLibrary((current) => !current)}
              className="border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-gold"
            >
              {showLibrary ? "Masquer les médias" : "Choisir un média"}
            </button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
      />

      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="https://..."
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />

      {helpText ? <p className="text-xs text-muted-foreground">{helpText}</p> : null}

      <div className="overflow-hidden rounded-md border border-border bg-secondary">
        <div className="flex aspect-[16/9] items-center justify-center bg-muted/30">
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs uppercase tracking-wide">Aucune image sélectionnée</span>
            </div>
          )}
        </div>
      </div>

      {showLibrary ? (
        <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto rounded-md border border-border p-3 md:grid-cols-3">
          {library.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => setValue(asset.url)}
              className="overflow-hidden rounded-md border border-border bg-background text-left transition-colors hover:border-gold"
            >
              <div className="aspect-[4/3] bg-muted">
                <img src={asset.url} alt={asset.title} className="h-full w-full object-cover" />
              </div>
              <div className="px-3 py-2 text-xs text-muted-foreground">{asset.title}</div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
