import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patrickfischerksa.github.io/ksa-zustaendigkeitsfinder/"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>
        {children}
      </body>
    </html>
  );
}
