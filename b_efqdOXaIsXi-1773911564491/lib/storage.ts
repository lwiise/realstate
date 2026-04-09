import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __cmsSupabaseAdmin: SupabaseClient | undefined;
  // eslint-disable-next-line no-var
  var __cmsStorageInitPromise: Promise<void> | undefined;
}

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

function buildAssetFilename(originalName: string) {
  const extension = path.extname(originalName) || ".jpg";
  return sanitizeFileName(`${Date.now()}-${randomUUID()}${extension}`);
}

function resolveMimeType(file: { name: string; type?: string | null }) {
  if (file.type) {
    return file.type;
  }

  const extension = path.extname(file.name).toLowerCase();

  switch (extension) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    case ".m4v":
      return "video/x-m4v";
    default:
      return "application/octet-stream";
  }
}

export function isRemoteStorageConfigured() {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.SUPABASE_STORAGE_BUCKET
  );
}

function getStorageFileSizeLimit() {
  return process.env.SUPABASE_STORAGE_FILE_SIZE_LIMIT || "50MB";
}

function getStorageBucket() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;

  if (!bucket) {
    throw new Error("SUPABASE_STORAGE_BUCKET is required for remote media storage.");
  }

  return bucket;
}

function getSupabaseAdmin() {
  if (globalThis.__cmsSupabaseAdmin) {
    return globalThis.__cmsSupabaseAdmin;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase storage environment variables are missing.");
  }

  const client = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  globalThis.__cmsSupabaseAdmin = client;
  return client;
}

export async function ensureRemoteStorage() {
  if (!isRemoteStorageConfigured()) {
    return;
  }

  if (!globalThis.__cmsStorageInitPromise) {
    globalThis.__cmsStorageInitPromise = (async () => {
      const supabase = getSupabaseAdmin();
      const bucket = getStorageBucket();
      const { data, error } = await supabase.storage.getBucket(bucket);

      if (error && error.message.toLowerCase().includes("not found")) {
        const createResult = await supabase.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: getStorageFileSizeLimit(),
        });

        if (createResult.error) {
          throw createResult.error;
        }

        return;
      }

      if (error && !data) {
        throw error;
      }

      const updateResult = await supabase.storage.updateBucket(bucket, {
        public: true,
        fileSizeLimit: getStorageFileSizeLimit(),
      });

      if (updateResult.error) {
        throw updateResult.error;
      }
    })();
  }

  await globalThis.__cmsStorageInitPromise;
}

export async function uploadCmsImage(file: File) {
  return uploadCmsAsset(file);
}

export async function createSignedCmsAssetUpload(input: {
  originalName: string;
  contentType?: string | null;
}) {
  if (!isRemoteStorageConfigured()) {
    throw new Error("Le stockage distant n'est pas configure pour les uploads signes.");
  }

  await ensureRemoteStorage();

  const bucket = getStorageBucket();
  const filename = buildAssetFilename(input.originalName);
  const mimeType = resolveMimeType(
    { name: input.originalName, type: input.contentType ?? undefined }
  );
  const filePath = `cms/${new Date().toISOString().slice(0, 10)}/${filename}`;
  const supabase = getSupabaseAdmin();
  const signed = await supabase.storage.from(bucket).createSignedUploadUrl(filePath);

  if (signed.error) {
    throw signed.error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return {
    signedUrl: signed.data.signedUrl,
    token: signed.data.token,
    path: signed.data.path,
    filename,
    url: data.publicUrl,
    mimeType,
  };
}

export async function uploadCmsAsset(file: File) {
  const fileName = buildAssetFilename(file.name);
  const contentType = resolveMimeType(file);

  if (process.env.NETLIFY === "true" && !isRemoteStorageConfigured()) {
    throw new Error(
      "Supabase storage environment variables are required on Netlify for persistent media uploads."
    );
  }

  if (isRemoteStorageConfigured()) {
    await ensureRemoteStorage();

    const bucket = getStorageBucket();
    const filePath = `cms/${new Date().toISOString().slice(0, 10)}/${fileName}`;
    const supabase = getSupabaseAdmin();
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await supabase.storage.from(bucket).upload(filePath, buffer, {
      contentType,
      upsert: false,
    });

    if (uploadResult.error) {
      throw uploadResult.error;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      filename: fileName,
      url: data.publicUrl,
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const publicDirectory = path.join(process.cwd(), "public", "uploads");
  const absolutePath = path.join(publicDirectory, fileName);

  await fs.mkdir(publicDirectory, { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  return {
    filename: fileName,
    url: `/uploads/${fileName}`,
  };
}
