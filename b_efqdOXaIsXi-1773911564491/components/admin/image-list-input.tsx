"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GripVertical, Link2, Loader2, Plus, UploadCloud, X } from "lucide-react";
import { uploadAdminAsset } from "@/components/admin/admin-asset-upload";
import { useAdminUploads } from "@/components/admin/admin-upload-context";
import type { MediaAsset } from "@/lib/cms-types";

// Number of files uploaded in parallel during a bulk upload. Uploads go directly to
// Supabase via signed URLs (see admin-asset-upload.ts), so a small pool is plenty.
const MAX_CONCURRENT_UPLOADS = 4;

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
  uploading?: boolean;
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
    defaultValue.filter(Boolean).map((value) => ({ id: createId(), value, previewUrl: value }))
  );
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messageTone, setMessageTone] = useState<"error" | "warning" | "">("");
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [isFileDragging, setIsFileDragging] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");

  const { startUpload, finishUpload } = useAdminUploads();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Object URLs created for instant previews while a file uploads; revoked when done.
  const objectUrlsRef = useRef(new Map<string, string>());

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  // The submitted value: the ordered list of non-empty URLs (drag order is preserved here).
  const payload = useMemo(
    () => JSON.stringify(items.map((item) => item.value.trim()).filter(Boolean)),
    [items]
  );

  const revokePreview = (itemId: string) => {
    const existing = objectUrlsRef.current.get(itemId);
    if (existing) {
      URL.revokeObjectURL(existing);
      objectUrlsRef.current.delete(itemId);
    }
  };

  const removeItem = (itemId: string) => {
    revokePreview(itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const appendUrl = (url: string) => {
    const value = url.trim();
    if (!value) return;
    setItems((current) => [...current, { id: createId(), value, previewUrl: value }]);
  };

  // ---- Bulk upload ---------------------------------------------------------
  const handleFiles = async (fileList: FileList | File[] | null) => {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;

    setMessage("");
    setMessageTone("");

    // Show every selected file immediately as a thumbnail with an "uploading" overlay.
    const queue = files.map((file) => {
      const id = createId();
      const objectUrl = URL.createObjectURL(file);
      objectUrlsRef.current.set(id, objectUrl);
      return { id, file };
    });
    setItems((current) => [
      ...current,
      ...queue.map(({ id }) => ({
        id,
        value: "",
        previewUrl: objectUrlsRef.current.get(id) ?? "",
        uploading: true,
      })),
    ]);

    setProgress({ done: 0, total: queue.length });

    let cursor = 0;
    let failures = 0;
    let lastWarning = "";

    const worker = async () => {
      while (cursor < queue.length) {
        const current = queue[cursor++];
        startUpload();
        try {
          const result = await uploadAdminAsset(current.file);
          revokePreview(current.id);
          setItems((list) =>
            list.map((item) =>
              item.id === current.id
                ? { ...item, value: result.url, previewUrl: result.url, uploading: false }
                : item
            )
          );
          if (result.warning) lastWarning = result.warning;
        } catch (error) {
          failures += 1;
          console.error("[admin] Bulk image upload failed", error);
          revokePreview(current.id);
          setItems((list) => list.filter((item) => item.id !== current.id));
        } finally {
          finishUpload();
          setProgress((value) => (value ? { ...value, done: value.done + 1 } : value));
        }
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(MAX_CONCURRENT_UPLOADS, queue.length) }, () => worker())
    );

    setProgress(null);
    if (failures > 0) {
      setMessage(
        `${failures} image${failures > 1 ? "s n'ont pas pu être téléversées" : " n'a pas pu être téléversée"}.`
      );
      setMessageTone("error");
    } else if (lastWarning) {
      setMessage(lastWarning);
      setMessageTone("warning");
    }
  };

  // ---- Drag to reorder (native HTML5 DnD) ----------------------------------
  const moveItem = (fromId: string, toId: string) => {
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === fromId);
      const toIndex = current.findIndex((item) => item.id === toId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const isUploading = progress !== null;

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between gap-2">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {items.length > 0 ? (
            <span className="text-xs text-muted-foreground">{items.length} image{items.length > 1 ? "s" : ""}</span>
          ) : null}
        </div>
        {helpText ? <p className="mt-1 text-xs text-muted-foreground">{helpText}</p> : null}
        <p className="mt-1 text-xs text-muted-foreground">
          Glissez-déposez pour téléverser plusieurs images, puis réorganisez-les par glisser-déposer.
        </p>
        {message ? (
          <p className={`mt-1 text-xs ${messageTone === "error" ? "text-destructive" : "text-amber-600"}`}>
            {message}
          </p>
        ) : null}
      </div>

      {/* Submitted value (ordered list of URLs) */}
      <input type="hidden" name={name} value={payload} />

      {/* Multi-file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          void handleFiles(event.target.files);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      {/* Bulk upload dropzone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          if (event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            setIsFileDragging(true);
          }
        }}
        onDragLeave={() => setIsFileDragging(false)}
        onDrop={(event) => {
          if (event.dataTransfer.types.includes("Files")) {
            event.preventDefault();
            setIsFileDragging(false);
            void handleFiles(event.dataTransfer.files);
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-6 text-center transition-colors ${
          isFileDragging ? "border-gold bg-gold/5" : "border-border hover:border-gold"
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
            <p className="text-sm font-medium text-foreground">
              Téléversement {progress?.done}/{progress?.total}…
            </p>
          </>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Cliquez ou déposez vos images ici
            </p>
            <p className="text-xs text-muted-foreground">Plusieurs images à la fois (JPG, PNG, WebP…)</p>
          </>
        )}
      </div>

      {/* Thumbnail grid (drag to reorder) */}
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.id}
              draggable={!item.uploading}
              onDragStart={(event) => {
                setDraggingId(item.id);
                event.dataTransfer.effectAllowed = "move";
                try {
                  event.dataTransfer.setData("text/plain", item.id);
                } catch {
                  // some browsers require setData; ignore if unavailable
                }
              }}
              onDragOver={(event) => {
                if (!draggingId) return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                if (draggingId !== item.id) setDragOverId(item.id);
              }}
              onDragLeave={() => setDragOverId((current) => (current === item.id ? null : current))}
              onDrop={(event) => {
                event.preventDefault();
                if (draggingId && draggingId !== item.id) moveItem(draggingId, item.id);
                setDraggingId(null);
                setDragOverId(null);
              }}
              onDragEnd={() => {
                setDraggingId(null);
                setDragOverId(null);
              }}
              className={`group relative overflow-hidden rounded-md border bg-secondary transition-all ${
                draggingId === item.id ? "opacity-40" : ""
              } ${dragOverId === item.id ? "border-gold ring-2 ring-gold" : "border-border"} ${
                item.uploading ? "cursor-default" : "cursor-grab active:cursor-grabbing"
              }`}
            >
              <div className="aspect-square">
                {item.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.previewUrl}
                    alt={`${label} ${index + 1}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : null}
              </div>

              {/* Order badge */}
              <span className="absolute left-1.5 top-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                {index + 1}
              </span>

              {/* Drag affordance */}
              {!item.uploading ? (
                <span className="absolute right-1.5 top-1.5 rounded bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
              ) : null}

              {/* Uploading overlay */}
              {item.uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label="Supprimer l'image"
                  className="absolute bottom-1.5 right-1.5 inline-flex items-center justify-center rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-all hover:bg-destructive group-hover:opacity-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Secondary inputs: add by URL + choose from media library */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2">
          <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="url"
            value={urlDraft}
            onChange={(event) => setUrlDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                appendUrl(urlDraft);
                setUrlDraft("");
              }
            }}
            placeholder="Ajouter par URL : https://…"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => {
              appendUrl(urlDraft);
              setUrlDraft("");
            }}
            className="inline-flex shrink-0 items-center gap-1 border border-border px-3 py-2 text-xs uppercase tracking-wide transition-colors hover:border-gold"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {imageLibrary.length > 0 ? (
          <select
            value=""
            onChange={(event) => {
              if (event.target.value) appendUrl(event.target.value);
              event.target.value = "";
            }}
            className="rounded-md border border-border bg-background px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground"
          >
            <option value="">Choisir dans la médiathèque</option>
            {imageLibrary.map((asset) => (
              <option key={asset.id} value={asset.url}>
                {asset.title}
              </option>
            ))}
          </select>
        ) : null}
      </div>
    </div>
  );
}
