"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import type { MediaAsset } from "@/lib/cms-types";

interface ImageListInputProps {
  name: string;
  label: string;
  defaultValue?: string[];
  library?: MediaAsset[];
  helpText?: string;
}

export function ImageListInput({
  name,
  label,
  defaultValue = [],
  library = [],
  helpText,
}: ImageListInputProps) {
  const [items, setItems] = useState<string[]>(defaultValue.length > 0 ? defaultValue : [""]);
  const [uploadIndex, setUploadIndex] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const payload = useMemo(
    () => JSON.stringify(items.map((item) => item.trim()).filter(Boolean)),
    [items]
  );

  const updateItem = (index: number, nextValue: string) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  };

  const addItem = () => setItems((current) => [...current, ""]);
  const removeItem = (index: number) => {
    setItems((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length > 0 ? next : [""];
    });
  };

  const handleUpload = (file: File | null) => {
    if (!file || uploadIndex == null) return;

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
      updateItem(uploadIndex, payload.url);
      setUploadIndex(null);
    });
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
      </div>

      <input type="hidden" name={name} value={payload} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${name}-${index}`} className="rounded-md border border-border p-3">
            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-md border border-border bg-secondary">
                <div className="aspect-[4/3]">
                  {item ? (
                    <img src={item} alt={`Galerie ${index + 1}`} className="h-full w-full object-cover" />
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={item}
                  onChange={(event) => updateItem(index, event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadIndex(index);
                      inputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
                  >
                    {isPending && uploadIndex === index ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    Téléverser
                  </button>

                  {library.length > 0 ? (
                    <select
                      value=""
                      onChange={(event) => {
                        if (event.target.value) {
                          updateItem(index, event.target.value);
                        }
                      }}
                      className="rounded-md border border-border bg-background px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      <option value="">Choisir un média</option>
                      {library.map((asset) => (
                        <option key={asset.id} value={asset.url}>
                          {asset.title}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
      >
        <ImagePlus className="h-4 w-4" />
        Ajouter une image
      </button>
    </div>
  );
}
