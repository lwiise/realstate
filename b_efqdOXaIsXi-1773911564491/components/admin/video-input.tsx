"use client";

import { useEffect, useRef, useState } from "react";
import { Film, Loader2, Trash2, Upload } from "lucide-react";
import { uploadAdminAsset } from "@/components/admin/admin-asset-upload";
import { useAdminUploads } from "@/components/admin/admin-upload-context";

interface VideoInputProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  helpText?: string;
}

export function VideoInput({ name, label, defaultValue, helpText }: VideoInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [previewUrl, setPreviewUrl] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [messageTone, setMessageTone] = useState<"error" | "warning" | "">("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const { startUpload, finishUpload } = useAdminUploads();

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
    const previousValue = value;
    const objectUrl = URL.createObjectURL(file);
    clearTemporaryPreview();
    objectUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setIsUploading(true);
    setMessage("");
    setMessageTone("");
    startUpload();

    try {
      const payload = await uploadAdminAsset(file);
      setValue(payload.url);
      updatePreview(payload.url);
      if (payload.warning) {
        setMessage(payload.warning);
        setMessageTone("warning");
      }
    } catch (error) {
      console.error("[admin] Video upload failed", error);
      setValue(previousValue);
      updatePreview(previousPreview);
      setMessage(error instanceof Error ? error.message : "Le televersement de la video a echoue.");
      setMessageTone("error");
    } finally {
      setIsUploading(false);
      finishUpload();

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setValue("");
    updatePreview("");
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
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Televerser
          </button>
          {value ? (
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          ) : null}
        </div>
      </div>

      <input type="hidden" name={name} value={value} />
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
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
        <div className="flex aspect-video items-center justify-center bg-muted/30">
          {previewUrl ? (
            <video
              key={previewUrl}
              src={previewUrl}
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Film className="h-6 w-6" />
              <span className="text-xs uppercase tracking-wide">Aucune video selectionnee</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
