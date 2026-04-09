"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { uploadAdminAsset } from "@/components/admin/admin-asset-upload";
import { useAdminUploads } from "@/components/admin/admin-upload-context";
import type { MediaAsset } from "@/lib/cms-types";

interface ImageListInputProps {
  name: string;
  label: string;
  defaultValue?: string[];
  library?: MediaAsset[];
  helpText?: string;
}

interface ImageListItem {
  id: string;
  value: string;
  previewUrl: string;
}

export function ImageListInput({
  name,
  label,
  defaultValue = [],
  library = [],
  helpText,
}: ImageListInputProps) {
  const imageLibrary = useMemo(
    () => library.filter((asset) => asset.mimeType.startsWith("image/")),
    [library]
  );
  const nextIdRef = useRef(0);
  const createId = () => `${name}-${nextIdRef.current++}`;
  const [items, setItems] = useState<ImageListItem[]>(
    defaultValue.length > 0
      ? defaultValue.map((item) => ({
          id: createId(),
          value: item,
          previewUrl: item,
        }))
      : [{ id: createId(), value: "", previewUrl: "" }]
  );
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messageTone, setMessageTone] = useState<"error" | "warning" | "">("");
  const uploadTargetRef = useRef<string | null>(null);
  const { startUpload, finishUpload } = useAdminUploads();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlsRef = useRef(new Map<string, string>());

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  const payload = useMemo(
    () => JSON.stringify(items.map((item) => item.value.trim()).filter(Boolean)),
    [items]
  );

  const clearTemporaryPreview = (itemId: string) => {
    const existing = objectUrlsRef.current.get(itemId);
    if (existing) {
      URL.revokeObjectURL(existing);
      objectUrlsRef.current.delete(itemId);
    }
  };

  const updateItem = (itemId: string, nextValue: string) => {
    clearTemporaryPreview(itemId);
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, value: nextValue, previewUrl: nextValue } : item
      )
    );
  };

  const setPreviewOnly = (itemId: string, previewUrl: string) => {
    setItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, previewUrl } : item))
    );
  };

  const addItem = () =>
    setItems((current) => [...current, { id: createId(), value: "", previewUrl: "" }]);

  const removeItem = (itemId: string) => {
    clearTemporaryPreview(itemId);
    setItems((current) => {
      const next = current.filter((item) => item.id !== itemId);
      return next.length > 0 ? next : [{ id: createId(), value: "", previewUrl: "" }];
    });
  };

  const handleUpload = async (file: File | null) => {
    const itemId = uploadTargetRef.current;
    if (!file || !itemId) return;

    const item = items.find((entry) => entry.id === itemId);
    const previousPreview = item?.previewUrl ?? "";
    const objectUrl = URL.createObjectURL(file);
    clearTemporaryPreview(itemId);
    objectUrlsRef.current.set(itemId, objectUrl);
    setPreviewOnly(itemId, objectUrl);
    setMessage("");
    setMessageTone("");
    startUpload();

    try {
      const responsePayload = await uploadAdminAsset(file);

      clearTemporaryPreview(itemId);
      setItems((current) =>
        current.map((entry) =>
          entry.id === itemId
            ? { ...entry, value: responsePayload.url, previewUrl: responsePayload.url }
            : entry
        )
      );
      if (responsePayload.warning) {
        setMessage(responsePayload.warning);
        setMessageTone("warning");
      }
    } catch (error) {
      console.error("[admin] Gallery upload failed", error);
      clearTemporaryPreview(itemId);
      setPreviewOnly(itemId, previousPreview);
      setMessage(
        error instanceof Error ? error.message : "Le televersement de l'image a echoue."
      );
      setMessageTone("error");
    } finally {
      finishUpload();
      uploadTargetRef.current = null;
      setUploadingItemId(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium text-foreground">{label}</label>
        {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
        {message ? (
          <p
            className={`mt-1 text-xs ${
              messageTone === "error" ? "text-destructive" : "text-amber-600"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>

      <input type="hidden" name={name} value={payload} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.id} className="rounded-md border border-border p-3">
            <div className="grid gap-3 md:grid-cols-[120px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-md border border-border bg-secondary">
                <div className="aspect-[4/3]">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={`Galerie ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={item.value}
                  onChange={(event) => updateItem(item.id, event.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      uploadTargetRef.current = item.id;
                      setUploadingItemId(item.id);
                      inputRef.current?.click();
                    }}
                    className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
                  >
                    {uploadingItemId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    Televerser
                  </button>

                  {imageLibrary.length > 0 ? (
                    <select
                      value=""
                      onChange={(event) => {
                        if (event.target.value) {
                          updateItem(item.id, event.target.value);
                        }
                      }}
                      className="rounded-md border border-border bg-background px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground"
                    >
                      <option value="">Choisir un media</option>
                      {imageLibrary.map((asset) => (
                        <option key={asset.id} value={asset.url}>
                          {asset.title}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
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
