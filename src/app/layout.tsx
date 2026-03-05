import type { Metadata } from "next";
import { Cinzel, Crimson_Text } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "WoWnator — Adivinhe o Campeão de Azeroth",
  description:
    "Jogo diário de adivinhação inspirado em World of Warcraft. Teste seus conhecimentos sobre personagens, zonas, montarias, habilidades e citações!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${cinzel.variable} ${crimsonText.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
