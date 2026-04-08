import { getNavigationSettings } from "@/lib/cms";
import { NavbarClient } from "@/components/navbar-client";

export async function Navbar() {
  return <NavbarClient navigation={await getNavigationSettings()} />;
}
