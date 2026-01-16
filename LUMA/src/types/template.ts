export interface TemplateData {
    groomName: string;
    brideName: string;
    date: string;
    heroImage: string;

    // Couple Section
    couple: {
        image: string;
        description: string;
        brideBio: string;
        groomBio: string;
    };

    // Ceremony & Reception
    ceremony: {
        date: string;
        time: string;
        locationName: string;
        address: string;
        mapLink: string;
    };
    reception: {
        locationName: string;
        address: string;
        mapLink: string;
    };

    // Gallery
    gallery: string[]; // For now just 1-3 images for simplicity in free tier

    // Fixed/Premium settings could be tracked here too or separate
}

export const defaultTemplateData: TemplateData = {
    groomName: "Pedro",
    brideName: "Ana",
    date: "2025-10-25",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",

    couple: {
        image: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        description: "Nossa história começou de forma inesperada...",
        brideBio: "Ana ama café, livros e dias chuvosos.",
        groomBio: "Pedro ama futebol, churrasco e dias de sol."
    },

    ceremony: {
        date: "2025-10-25",
        time: "16:00",
        locationName: "Capela dos Milagres",
        address: "Rua das Flores, 123",
        mapLink: "#"
    },
    reception: {
        locationName: "Salão de Festas Jardim",
        address: "Av. Principal, 400",
        mapLink: "#"
    },

    gallery: [
        "https://images.unsplash.com/photo-1519225448526-0a0295155cd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"
    ]
};
