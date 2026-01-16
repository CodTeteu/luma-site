/**
 * Gallery image with unique ID for safe reordering/deletion
 */
export interface GalleryImage {
    id: string;
    url: string;
}

/**
 * Section visibility configuration
 */
export interface SectionVisibility {
    isVisible: boolean;
}

/**
 * Main template data structure for wedding sites
 */
export interface TemplateData {
    groomName: string;
    brideName: string;
    date: string;
    heroImage: string;

    // Hero section visibility
    hero: SectionVisibility;

    // Couple Section
    couple: SectionVisibility & {
        image: string;
        description: string;
        brideBio: string;
        groomBio: string;
    };

    // Ceremony & Reception
    ceremony: SectionVisibility & {
        date: string;
        time: string;
        locationName: string;
        address: string;
        mapLink: string;
    };
    reception: SectionVisibility & {
        locationName: string;
        address: string;
        mapLink: string;
    };

    // Gallery section
    gallery: SectionVisibility & {
        images: GalleryImage[];
    };

    // RSVP section
    rsvp: SectionVisibility;

    // Gifts section
    gifts: SectionVisibility;
}

/**
 * Generate a unique ID for gallery images
 */
export function generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Default template data with all sections visible
 */
export const defaultTemplateData: TemplateData = {
    groomName: "Pedro",
    brideName: "Ana",
    date: "2025-10-25",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",

    hero: {
        isVisible: true,
    },

    couple: {
        isVisible: true,
        image: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "Nossa história começou de forma inesperada...",
        brideBio: "Ana ama café, livros e dias chuvosos.",
        groomBio: "Pedro ama futebol, churrasco e dias de sol."
    },

    ceremony: {
        isVisible: true,
        date: "2025-10-25",
        time: "16:00",
        locationName: "Capela dos Milagres",
        address: "Rua das Flores, 123",
        mapLink: "#"
    },

    reception: {
        isVisible: true,
        locationName: "Salão de Festas Jardim",
        address: "Av. Principal, 400",
        mapLink: "#"
    },

    gallery: {
        isVisible: true,
        images: [
            { id: "img_default_1", url: "https://images.unsplash.com/photo-1519225448526-0a0295155cd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" },
            { id: "img_default_2", url: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" },
            { id: "img_default_3", url: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" }
        ]
    },

    rsvp: {
        isVisible: true,
    },

    gifts: {
        isVisible: true,
    }
};
