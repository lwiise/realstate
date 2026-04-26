import { getNavigationSettings } from "@/lib/cms";
import { NavbarClient } from "@/components/navbar-client";

interface NavbarProps {
  topOffsetClassName?: string;
}

export async function Navbar({ topOffsetClassName }: NavbarProps = {}) {
  return (
    <NavbarClient
      navigation={await getNavigationSettings()}
      topOffsetClassName={topOffsetClassName}
    />
  );
}
