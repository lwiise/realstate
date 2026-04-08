import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth";
import { createMediaAsset } from "@/lib/cms";

function sanitizeFileName(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

export async function POST(request: Request) {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const publicDirectory = path.join(process.cwd(), "public", "uploads");
  const absolutePath = path.join(publicDirectory, sanitizeFileName(fileName));

  await fs.mkdir(publicDirectory, { recursive: true });
  await fs.writeFile(absolutePath, buffer);

  const publicUrl = `/uploads/${path.basename(absolutePath)}`;

  const assetId = createMediaAsset({
    title: file.name,
    originalName: file.name,
    filename: path.basename(absolutePath),
    mimeType: file.type,
    url: publicUrl,
    altText: "",
  });

  return NextResponse.json({
    id: assetId,
    url: publicUrl,
  });
}
