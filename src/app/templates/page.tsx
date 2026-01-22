import { Metadata } from "next";
import {
    TemplatesHeroSection,
    TemplatesGrid,
    TemplatesCTASection,
} from "@/components/templates";
import { Navigation, Footer, LuxuryDivider } from "@/components/landing";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Templates de Site para Casamento | LUMA - 10 Designs Exclusivos",
    description:
        "Escolha entre 10 templates exclusivos para seu site de casamento. Designs elegantes por R$197 com RSVP, lista de presentes e personalização completa. Entrega em 48h.",
    keywords: [
        "templates casamento",
        "site casamento",
        "convite digital casamento",
        "RSVP casamento",
        "lista de presentes pix",
        "site de casamento personalizado",
        "design casamento",
        "LUMA templates",
        "convite online casamento",
    ],
    openGraph: {
        title: "Templates de Site para Casamento | LUMA",
        description: "10 designs exclusivos. R$197 tudo incluso. Entrega em 48h.",
        type: "website",
        locale: "pt_BR",
        siteName: "LUMA",
    },
    twitter: {
        card: "summary_large_image",
        title: "Templates de Site para Casamento | LUMA",
        description: "10 designs exclusivos. R$197 tudo incluso.",
    },
    alternates: {
        canonical: "https://luma.com.br/templates",
    },
};

// Product structured data for templates
const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Site de Casamento LUMA",
    description:
        "Site de casamento exclusivo com RSVP via WhatsApp, lista de presentes com PIX direto e painel administrativo.",
    brand: {
        "@type": "Brand",
        name: "LUMA",
    },
    offers: {
        "@type": "Offer",
        price: "197.00",
        priceCurrency: "BRL",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2026-12-31",
        seller: {
            "@type": "Organization",
            name: "LUMA Studio",
        },
    },
    aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5.0",
        reviewCount: "150",
    },
};

// Breadcrumb structured data
const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://luma.com.br",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Templates",
            item: "https://luma.com.br/templates",
        },
    ],
};

/**
 * Templates gallery page showcasing all available wedding website templates.
 */
export default function TemplatesPage() {
    return (
        <>
            {/* Structured Data for SEO */}
            <Script
                id="product-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <Script
                id="breadcrumb-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <main className="min-h-screen bg-[#F7F5F0]">
                <Navigation />
                <TemplatesHeroSection />
                <LuxuryDivider />
                <TemplatesGrid />
                <TemplatesCTASection />
                <Footer />
            </main>
        </>
    );
}
