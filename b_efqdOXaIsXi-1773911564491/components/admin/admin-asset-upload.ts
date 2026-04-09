"use client";

interface PrepareUploadPayload {
  action: "prepare";
  filename: string;
  contentType: string;
}

interface CompleteUploadPayload {
  action: "complete";
  originalName: string;
  filename: string;
  mimeType: string;
  url: string;
}

interface PrepareResponse {
  strategy?: "signed" | "direct";
  signedUrl?: string;
  filename?: string;
  url?: string;
  mimeType?: string;
  error?: string;
}

interface CompleteResponse {
  id?: number | null;
  url?: string;
  warning?: string | null;
  error?: string;
}

interface DirectResponse {
  id?: number | null;
  url?: string;
  warning?: string | null;
  error?: string;
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

async function finalizeAdminUpload(payload: CompleteUploadPayload) {
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await readJson<CompleteResponse>(response);

  if (!response.ok) {
    throw new Error(data.error || "La finalisation du media a echoue.");
  }

  return data;
}

async function uploadDirectly(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await readJson<DirectResponse>(response);

  if (!response.ok) {
    throw new Error(data.error || `Upload failed with status ${response.status}`);
  }

  if (!data.url) {
    throw new Error("La reponse d'upload ne contient pas d'URL.");
  }

  return {
    url: data.url,
    warning: data.warning ?? null,
  };
}

export async function uploadAdminAsset(file: File) {
  const prepareResponse = await fetch("/api/admin/upload", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      action: "prepare",
      filename: file.name,
      contentType: file.type,
    } satisfies PrepareUploadPayload),
  });

  const prepareData = await readJson<PrepareResponse>(prepareResponse);

  if (!prepareResponse.ok) {
    throw new Error(prepareData.error || "La preparation du televersement a echoue.");
  }

  if (prepareData.strategy !== "signed") {
    return uploadDirectly(file);
  }

  if (!prepareData.signedUrl || !prepareData.url || !prepareData.filename) {
    throw new Error("Les informations de televersement signe sont incompletes.");
  }

  const uploadBody = new FormData();
  uploadBody.append("cacheControl", "3600");
  uploadBody.append("", file);

  const storageResponse = await fetch(prepareData.signedUrl, {
    method: "PUT",
    headers: {
      "x-upsert": "false",
    },
    body: uploadBody,
  });

  if (!storageResponse.ok) {
    const details = await storageResponse.text();
    throw new Error(details || "Le televersement vers le stockage a echoue.");
  }

  const completeData = await finalizeAdminUpload({
    action: "complete",
    originalName: file.name,
    filename: prepareData.filename,
    mimeType: prepareData.mimeType || file.type || "application/octet-stream",
    url: prepareData.url,
  });

  return {
    url: prepareData.url,
    warning: completeData.warning ?? null,
  };
}
