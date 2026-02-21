import { AuthView } from "@neondatabase/neon-js/auth/react";

export const dynamicParams = false;

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111] p-4">
      <AuthView path={path} />
    </main>
  );
}
