import type { Metadata } from "next";
import {
  Inter,
  Playfair_Display,
  Cormorant_Garamond,
  Lato,
  Montserrat,
  Pinyon_Script,
  Cinzel,
  Amatic_SC,
  Quicksand,
  Bodoni_Moda,
  Raleway,
  Great_Vibes,
  Space_Mono,
  Roboto
} from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Font configurations
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cormorant = Cormorant_Garamond({ weight: ["300", "400", "600"], subsets: ["latin"], variable: "--font-cormorant" });
const lato = Lato({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-lato" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const pinyon = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-pinyon" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const amatic = Amatic_SC({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-amatic" });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"], variable: "--font-great-vibes" });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });
const roboto = Roboto({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: "LUMA | Sites Exclusivos para Casamentos - R$197",
  description: "Estúdio de Tecnologia para Casamentos. Sites exclusivos com identidade visual fiel, RSVP Ativo via WhatsApp e Lista de Presentes com PIX direto. Entrega em 48h.",
  keywords: [
    "site casamento",
    "site de casamento",
    "convite digital casamento",
    "RSVP casamento",
    "lista de presentes pix",
    "site casamento personalizado",
    "convite online casamento",
    "LUMA casamentos",
    "site noivos",
    "wedding website brasil",
  ],
  authors: [{ name: "LUMA Studio" }],
  creator: "LUMA Studio",
  publisher: "LUMA Studio",
  robots: "index, follow",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://luma.com.br",
  },
  openGraph: {
    title: "LUMA | Sites Exclusivos para Casamentos",
    description: "Não alugue um template. Contrate um Estúdio Digital para o seu Casamento. R$197 tudo incluso.",
    type: "website",
    locale: "pt_BR",
    siteName: "LUMA",
    url: "https://luma.com.br",
    images: [
      {
        url: "/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "LUMA - Sites Exclusivos para Casamentos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMA | Sites Exclusivos para Casamentos",
    description: "Não alugue um template. Contrate um Estúdio Digital para o seu Casamento.",
  },
};

// JSON-LD Structured Data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LUMA",
  description: "Estúdio de Tecnologia para Casamentos. Sites exclusivos com identidade visual fiel.",
  url: "https://luma.com.br",
  logo: "https://luma.com.br/images/logo.png",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+55-51-98536-7454",
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
  sameAs: [
    "https://instagram.com/luma.casamentos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`
        antialiased bg-[#F7F5F0] text-[#3E4A3F]
        ${inter.variable} ${playfair.variable} ${cormorant.variable} 
        ${lato.variable} ${montserrat.variable} ${pinyon.variable} 
        ${cinzel.variable} ${amatic.variable} ${quicksand.variable} 
        ${bodoni.variable} ${raleway.variable} ${greatVibes.variable} 
        ${spaceMono.variable} ${roboto.variable}
      `}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

