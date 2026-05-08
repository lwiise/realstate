import { getNavigationSettings } from "@/lib/cms";
import { NavbarClient } from "@/components/navbar-client";
import { getRequestLocale } from "@/lib/i18n-server";
import { localizeNavigation } from "@/lib/i18n-content";

interface NavbarProps {
  topOffsetClassName?: string;
}

export async function Navbar({ topOffsetClassName }: NavbarProps = {}) {
  const locale = await getRequestLocale();
  const navigation = localizeNavigation(await getNavigationSettings(), locale);

  return (
    <NavbarClient
      navigation={navigation}
      locale={locale}
      topOffsetClassName={topOffsetClassName}
    />
  );
}
