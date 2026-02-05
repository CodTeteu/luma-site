/**
 * Site Configuration
 * Centralized configuration for all external links, contact info, and metadata.
 * ============================================================================
 */

export const siteConfig = {
  name: "LUMA Convites",
  tagline: "Convites Digitais Elegantes",
  description: "Crie convites digitais com RSVP, lista de presentes e galeria. Grátis para começar.",

  // Contact
  contact: {
    whatsapp: {
      number: "5551985367454",
      displayText: "Fale no WhatsApp",
      getUrl: (message?: string) => {
        const baseUrl = `https://wa.me/${siteConfig.contact.whatsapp.number}`;
        return message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
      },
    },
  },

  // External Links
  links: {
    instagram: "https://instagram.com/luma.casamentos",
    login: "/login",
    briefing: "/briefing",
    templates: "/templates",
  },

  // Contact Email
  email: "contato@luma.com.br",

  // Navigation
  navigation: {
    main: [
      { label: "Casamentos", href: "/casamento" },
      { label: "Formaturas", href: "/formatura" },
      { label: "Concierge", href: "/concierge" },
      { label: "Templates", href: "/templates" },
      { label: "Preços", href: "/precos" },
    ],
  },

  // SEO & Metadata
  metadata: {
    title: "LUMA | Seu Site de Casamento Cuidado por Especialistas",
    description:
      "Convites digitais premium para casamentos. Preencha nosso briefing e nossa equipe cria tudo para você.",
    keywords: ["casamento", "convite digital", "wedding", "RSVP", "lista de presentes"],
  },

  // Business Stats (for landing page)
  stats: {
    yearsExperience: "8+",
    weddingsCompleted: "4.5k",
    averageRating: "5.0",
    countriesServed: "12",
    couplesServed: "+150",
  },

  // Footer
  footer: {
    copyright: `© ${new Date().getFullYear()} LUMA Studio. Todos os direitos reservados.`,
  },
} as const;

export type SiteConfig = typeof siteConfig;
