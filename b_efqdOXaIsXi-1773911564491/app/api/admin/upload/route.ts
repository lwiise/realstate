import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth";
import { createMediaAsset } from "@/lib/cms";
import {
  createSignedCmsAssetUpload,
  isRemoteStorageConfigured,
  uploadCmsAsset,
} from "@/lib/storage";

interface PrepareUploadRequest {
  action: "prepare";
  filename?: string;
  contentType?: string;
}

interface CompleteUploadRequest {
  action: "complete";
  originalName?: string;
  filename?: string;
  mimeType?: string;
  url?: string;
}

function validateMediaFile(name: string, type: string) {
  const isImage = type.startsWith("image/") || /\.(jpe?g|png|webp|gif|svg)$/i.test(name);
  const isVideo = type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(name);

  return { isImage, isVideo, isValid: isImage || isVideo };
}

function isServerlessProduction() {
  return process.env.NETLIFY === "true" || process.env.VERCEL === "1";
}

async function saveMediaAssetRecord(input: {
  originalName: string;
  filename: string;
  mimeType: string;
  url: string;
}) {
  let assetId: number | null = null;
  let warning: string | null = null;

  try {
    assetId = await createMediaAsset({
      title: input.originalName,
      originalName: input.originalName,
      filename: input.filename,
      mimeType: input.mimeType,
      url: input.url,
      altText: "",
    });
  } catch (error) {
    console.error("[admin] Media asset record creation failed", error);
    warning = "Le fichier a ete televerse, mais il n'apparaitra pas tout de suite dans la mediatheque.";
  }

  return { assetId, warning };
}

async function ensureAdmin() {
  const admin = await getCurrentAdminUser();

  if (!admin) {
    return NextResponse.json(
      { error: "Votre session admin n'est pas disponible. Reconnectez-vous puis reessayez." },
      { status: 401 }
    );
  }

  return null;
}

async function handleJsonRequest(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return authError;
  }

  const payload = (await request.json()) as PrepareUploadRequest | CompleteUploadRequest;

  if (payload.action === "prepare") {
    const filename = payload.filename?.trim() ?? "";
    const contentType = payload.contentType?.trim() ?? "";

    if (!filename) {
      return NextResponse.json({ error: "Nom de fichier invalide." }, { status: 400 });
    }

    const validation = validateMediaFile(filename, contentType);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Seuls les fichiers image et video sont acceptes." },
        { status: 400 }
      );
    }

    if (!isRemoteStorageConfigured()) {
      if (isServerlessProduction()) {
        return NextResponse.json(
          {
            error:
              "Le stockage media distant n'est pas configure en production. Verifiez NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY et SUPABASE_STORAGE_BUCKET dans Netlify.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ strategy: "direct" });
    }

    const prepared = await createSignedCmsAssetUpload({
      originalName: filename,
      contentType,
    });

    return NextResponse.json({
      strategy: "signed",
      signedUrl: prepared.signedUrl,
      filename: prepared.filename,
      url: prepared.url,
      mimeType: prepared.mimeType,
    });
  }

  if (payload.action === "complete") {
    const originalName = payload.originalName?.trim() ?? "";
    const filename = payload.filename?.trim() ?? "";
    const mimeType = payload.mimeType?.trim() ?? "";
    const url = payload.url?.trim() ?? "";

    if (!originalName || !filename || !mimeType || !url) {
      return NextResponse.json(
        { error: "Les informations de finalisation du media sont incompletes." },
        { status: 400 }
      );
    }

    const saved = await saveMediaAssetRecord({
      originalName,
      filename,
      mimeType,
      url,
    });

    return NextResponse.json({
      id: saved.assetId,
      url,
      warning: saved.warning,
    });
  }

  return NextResponse.json({ error: "Action d'upload invalide." }, { status: 400 });
}

async function handleMultipartRequest(request: Request) {
  const authError = await ensureAdmin();
  if (authError) {
    return authError;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }

  if (!file.name) {
    return NextResponse.json({ error: "Nom de fichier invalide." }, { status: 400 });
  }

  const validation = validateMediaFile(file.name, file.type);

  if (!validation.isValid) {
    return NextResponse.json(
      { error: "Seuls les fichiers image et video sont acceptes." },
      { status: 400 }
    );
  }

  const uploaded = await uploadCmsAsset(file);
  const saved = await saveMediaAssetRecord({
    originalName: file.name,
    filename: uploaded.filename,
    mimeType: file.type || (validation.isVideo ? "video/mp4" : "image/jpeg"),
    url: uploaded.url,
  });

  return NextResponse.json({
    id: saved.assetId,
    url: uploaded.url,
    mimeType: file.type,
    warning: saved.warning,
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return await handleJsonRequest(request);
    }

    return await handleMultipartRequest(request);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Le televersement a echoue.";

    console.error("[admin] Upload route failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
