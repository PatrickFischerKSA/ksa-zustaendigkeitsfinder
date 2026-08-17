import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { PasswordGate } from "./PasswordGate";
import { accessCookieName, accessToken, safeEqual } from "./password-auth";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ksa-zustaendigkeitsfinder.patrickoliverfischer.chatgpt.site"),
  title: "KSA Zuständigkeitsfinder",
  description: "Schnell die richtige Ansprechperson an der KSA finden.",
  openGraph: {
    title: "KSA Zuständigkeitsfinder",
    description: "Wer kümmert sich eigentlich darum?",
    images: [{ url: "/og.png", width: 1728, height: 910, alt: "KSA Zuständigkeitsfinder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KSA Zuständigkeitsfinder",
    description: "Wer kümmert sich eigentlich darum?",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const currentToken = cookieStore.get(accessCookieName)?.value ?? "";
  const expectedToken = await accessToken();
  const isAuthenticated = Boolean(expectedToken && safeEqual(currentToken, expectedToken));

  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {isAuthenticated ? children : <PasswordGate />}
      </body>
    </html>
  );
}
