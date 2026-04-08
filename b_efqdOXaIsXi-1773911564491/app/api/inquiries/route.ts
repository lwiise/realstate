import { NextResponse } from "next/server";
import { createInquiry } from "@/lib/cms";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    propertyId?: number | null;
    propertyTitle?: string | null;
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
    sourcePage?: string;
  };

  if (!payload.name?.trim() || !payload.phone?.trim() || !payload.message?.trim()) {
    return NextResponse.json(
      { error: "Name, phone and message are required." },
      { status: 400 }
    );
  }

  const id = await createInquiry({
    propertyId: payload.propertyId ?? null,
    propertyTitle: payload.propertyTitle?.trim() ?? null,
    name: payload.name.trim(),
    email: payload.email?.trim() || null,
    phone: payload.phone.trim(),
    message: payload.message.trim(),
    sourcePage: payload.sourcePage?.trim() || "website",
  });

  return NextResponse.json({ ok: true, id });
}
