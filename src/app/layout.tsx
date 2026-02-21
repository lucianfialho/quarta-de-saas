import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react";
import { authClient } from "@/lib/auth/client";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quarta de SaaS",
  description:
    "Pitches de 5 minutos toda quarta-feira. Apresente seu SaaS para a comunidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <NeonAuthUIProvider authClient={authClient as any} redirectTo="/participar">
          {children}
        </NeonAuthUIProvider>
      </body>
    </html>
  );
}
