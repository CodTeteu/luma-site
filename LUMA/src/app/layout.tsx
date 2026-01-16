import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LUMA | Sites Exclusivos para Casamentos",
  description: "Estúdio de Tecnologia para Casamentos. Sites exclusivos com identidade visual fiel, RSVP Ativo via WhatsApp e Lista de Presentes com PIX direto.",
  keywords: "casamento, site casamento, RSVP, lista de presentes, wedding, site personalizado, cerimonialista, LUMA",
  openGraph: {
    title: "LUMA | Sites Exclusivos para Casamentos",
    description: "Não alugue um template. Contrate um Estúdio Digital para o seu Casamento.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#F7F5F0] text-[#3E4A3F]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

