import { NextResponse } from "next/server";
import { getCurrentAdminUser } from "@/lib/auth";
import { createMediaAsset } from "@/lib/cms";
import { uploadCmsAsset } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdminUser();
    if (!admin) {
      return NextResponse.json(
        { error: "Votre session admin n'est pas disponible. Reconnectez-vous puis reessayez." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
    }

    if (!file.name) {
      return NextResponse.json({ error: "Nom de fichier invalide." }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v)$/i.test(file.name);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Seuls les fichiers image et video sont acceptes." },
        { status: 400 }
      );
    }

    const uploaded = await uploadCmsAsset(file);
    let assetId: number | null = null;
    let warning: string | null = null;

    try {
      assetId = await createMediaAsset({
        title: file.name,
        originalName: file.name,
        filename: uploaded.filename,
        mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
        url: uploaded.url,
        altText: "",
      });
    } catch (error) {
      console.error("[admin] Media asset record creation failed", error);
      warning = "Le fichier a ete televerse, mais il n'apparaitra pas tout de suite dans la mediatheque.";
    }

    return NextResponse.json({
      id: assetId,
      url: uploaded.url,
      mimeType: file.type,
      warning,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Le televersement a echoue.";

    console.error("[admin] Upload route failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
