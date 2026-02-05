import { Metadata } from "next";
import {
    TemplatesHeroSection,
    TemplatesGrid,
    TemplatesCTASection,
} from "@/components/templates";
import { Navigation, Footer, LuxuryDivider } from "@/components/landing";
import Script from "next/script";

export const metadata: Metadata = {
    title: "Templates de Convites Digitais | LUMA - Casamento e Formatura",
    description:
        "Escolha entre nossos templates para seu convite digital. Comece grátis com RSVP, lista de presentes e galeria. Upgrade para Plus por R$97.",
    keywords: [
        "templates casamento",
        "templates formatura",
        "convite digital grátis",
        "convite digital casamento",
        "RSVP casamento",
        "lista de presentes pix",
        "convite online casamento",
        "convite online formatura",
    ],
    openGraph: {
        title: "Templates de Convites Digitais | LUMA",
        description: "Comece grátis. Upgrade para Plus por R$97.",
        type: "website",
        locale: "pt_BR",
        siteName: "LUMA Convites",
    },
    twitter: {
        card: "summary_large_image",
        title: "Templates de Convites Digitais | LUMA",
        description: "Comece grátis. Upgrade para Plus por R$97.",
    },
    alternates: {
        canonical: "https://lumaconvites.com.br/templates",
    },
};

// Product structured data for templates - Updated for freemium model
const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Convite Digital LUMA",
    description:
        "Convite digital com RSVP, lista de presentes PIX e galeria. Grátis para começar, upgrade Plus por R$97.",
    brand: {
        "@type": "Brand",
        name: "LUMA Convites",
    },
    offers: [
        {
            "@type": "Offer",
            name: "Grátis",
            price: "0.00",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            description: "Publicação gratuita com watermark e limites básicos",
        },
        {
            "@type": "Offer",
            name: "Plus",
            price: "97.00",
            priceCurrency: "BRL",
            availability: "https://schema.org/InStock",
            priceValidUntil: "2026-12-31",
            description: "Sem watermark, templates premium, RSVP ilimitado",
        },
    ],
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
            item: "https://lumaconvites.com.br",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Templates",
            item: "https://lumaconvites.com.br/templates",
        },
    ],
};

/**
 * Templates gallery page showcasing available invitation templates.
 * Freemium model: start free, upgrade to Plus for R$97.
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
