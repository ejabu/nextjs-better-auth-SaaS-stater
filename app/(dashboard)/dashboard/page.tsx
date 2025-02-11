import { auth } from "@/lib/auth";
import { Settings } from "./settings";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw redirect("/sign-in");
  }
  if (!session.session.activeOrganizationId) {
    await auth.api.setActiveOrganization({
      headers: await headers(),
      body: {
      },
    });
  }
  return <Settings />;
}
