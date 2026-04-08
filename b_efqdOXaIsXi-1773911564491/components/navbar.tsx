import { getNavigationSettings } from "@/lib/cms";
import { NavbarClient } from "@/components/navbar-client";

export function Navbar() {
  return <NavbarClient navigation={getNavigationSettings()} />;
}
