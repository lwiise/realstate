import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth";
import { createMediaAsset } from "@/lib/cms";
import { uploadCmsAsset } from "@/lib/storage";

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

  if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
    return NextResponse.json(
      { error: "Only image and video uploads are supported" },
      { status: 400 }
    );
  }

  const uploaded = await uploadCmsAsset(file);
  const assetId = await createMediaAsset({
    title: file.name,
    originalName: file.name,
    filename: uploaded.filename,
    mimeType: file.type,
    url: uploaded.url,
    altText: "",
  });

  return NextResponse.json({
    id: assetId,
    url: uploaded.url,
    mimeType: file.type,
  });
}
