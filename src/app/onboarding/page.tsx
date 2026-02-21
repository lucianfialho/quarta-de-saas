import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { OnboardingWizard } from "@/components/onboarding-wizard";

export const metadata = {
  title: "Onboarding | Quarta de SaaS",
};

export default async function OnboardingPage() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const userName = session.user.name ?? "Participante";

  return <OnboardingWizard userName={userName} />;
}
