import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SEWAPROYEKTOR.TGR",
    template: "%s | SEWAPROYEKTOR.TGR",
  },
  description:
    "Projector rental and equipment catalog for SEWAPROYEKTOR.TGR in Tangerang.",
  icons: {
    icon: "/light-logo.png",
    shortcut: "/light-logo.png",
    apple: "/light-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-white font-sans text-zinc-950">
        {children}
      </body>
    </html>
  );
}
