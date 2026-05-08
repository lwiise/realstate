import { headers } from "next/headers";
import type { Locale } from "@/lib/cms-types";

export async function getRequestLocale(): Promise<Locale> {
  const headerList = await headers();
  return headerList.get("x-site-locale") === "en" ? "en" : "fr";
}
