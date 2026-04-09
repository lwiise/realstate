"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { uploadAdminAsset } from "@/components/admin/admin-asset-upload";
import { useAdminUploads } from "@/components/admin/admin-upload-context";
import type { MediaAsset } from "@/lib/cms-types";

interface ImageInputProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  library?: MediaAsset[];
  helpText?: string;
  allowLibrary?: boolean;
}

export function ImageInput({
  name,
  label,
  defaultValue,
  library = [],
  helpText,
  allowLibrary = true,
}: ImageInputProps) {
  const imageLibrary = useMemo(
    () => library.filter((asset) => asset.mimeType.startsWith("image/")),
    [library]
  );
  const [value, setValue] = useState(defaultValue ?? "");
  const [previewUrl, setPreviewUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageTone, setMessageTone] = useState<"error" | "warning" | "">("");
  const { startUpload, finishUpload } = useAdminUploads();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const clearTemporaryPreview = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const updatePreview = (nextPreview: string) => {
    clearTemporaryPreview();
    setPreviewUrl(nextPreview);
  };

  const handleUpload = async (file: File | null) => {
    if (!file) return;

    const previousPreview = previewUrl;
    const objectUrl = URL.createObjectURL(file);
    clearTemporaryPreview();
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setIsUploading(true);
    setMessage("");
    setMessageTone("");
    startUpload();

    try {
      const result = await uploadAdminAsset(file);
      setValue(result.url);
      updatePreview(result.url);
      if (result.warning) {
        setMessage(result.warning);
        setMessageTone("warning");
      }
    } catch (error) {
      console.error("[admin] Image upload failed", error);
      updatePreview(previousPreview);
      setMessage(error instanceof Error ? error.message : "Le televersement de l'image a echoue.");
      setMessageTone("error");
    } finally {
      setIsUploading(false);
      finishUpload();

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleManualChange = (nextValue: string) => {
    setValue(nextValue);
    updatePreview(nextValue);
    setMessage("");
    setMessageTone("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Téléverser
          </button>
          {allowLibrary && imageLibrary.length > 0 ? (
            <button
              type="button"
              onClick={() => setShowLibrary((current) => !current)}
              className="border border-border px-3 py-2 text-xs uppercase tracking-wide text-foreground transition-colors hover:border-gold"
            >
              {showLibrary ? "Masquer les médias" : "Choisir un média"}
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
      />

      <input
        type="text"
        name={name}
        value={value}
        onChange={(event) => handleManualChange(event.target.value)}
        placeholder="https://..."
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />

      {helpText ? <p className="text-xs text-muted-foreground">{helpText}</p> : null}
      {message ? (
        <p
          className={`text-xs ${messageTone === "error" ? "text-destructive" : "text-amber-600"}`}
        >
          {message}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-md border border-border bg-secondary">
        <div className="flex aspect-[16/9] items-center justify-center bg-muted/30">
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs uppercase tracking-wide">Aucune image sélectionnée</span>
            </div>
          )}
        </div>
      </div>

      {allowLibrary && showLibrary ? (
        <div className="grid max-h-64 grid-cols-2 gap-3 overflow-y-auto rounded-md border border-border p-3 md:grid-cols-3">
          {imageLibrary.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => {
                setValue(asset.url);
                updatePreview(asset.url);
              }}
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
