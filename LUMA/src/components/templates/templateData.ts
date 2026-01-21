/**
 * Template data definitions for the templates gallery page.
 */

export type TemplateCategory = 'classico' | 'moderno' | 'minimalista' | 'boho' | 'romantico';

export interface Template {
    id: string;
    name: string;
    style: string;
    category: TemplateCategory;
    description: string;
    tags: string[];
    image: string;
    popular?: boolean;
    new?: boolean;
}

export const templates: Template[] = [
    {
        id: 'elegance',
        name: 'Elegance',
        style: 'Clássico Dourado',
        category: 'classico',
        description: 'Sofisticação atemporal com detalhes em dourado e tipografia elegante. Perfeito para cerimônias tradicionais em salões refinados.',
        tags: ['Luxo', 'Tradicional', 'Salão'],
        image: '/images/templates/elegance.png',
        popular: true,
    },
    {
        id: 'garden',
        name: 'Garden',
        style: 'Jardim Romântico',
        category: 'romantico',
        description: 'Tons suaves de rosa e verde sálvia com ilustrações florais delicadas. Ideal para casamentos ao ar livre em jardins.',
        tags: ['Floral', 'Ar Livre', 'Romântico'],
        image: '/images/templates/garden.png',
        popular: true,
    },
    {
        id: 'marble',
        name: 'Marble',
        style: 'Minimalista Mármore',
        category: 'minimalista',
        description: 'Design clean com textura de mármore e detalhes geométricos em dourado. Elegância contemporânea e sofisticada.',
        tags: ['Moderno', 'Clean', 'Elegante'],
        image: '/images/templates/marble.png',
        new: true,
    },
    {
        id: 'sunset',
        name: 'Sunset',
        style: 'Praia Sunset',
        category: 'romantico',
        description: 'Gradientes quentes de laranja e rosa com elementos tropicais. Perfeito para destination weddings na praia.',
        tags: ['Praia', 'Tropical', 'Destino'],
        image: '/images/templates/sunset.png',
    },
    {
        id: 'bohemian',
        name: 'Bohemian',
        style: 'Boho Chic',
        category: 'boho',
        description: 'Estilo livre e artístico com cores terrosas e elementos naturais como pampas e macramê. Para casais autênticos.',
        tags: ['Boho', 'Natural', 'Artístico'],
        image: '/images/templates/bohemian.png',
        popular: true,
    },
    {
        id: 'vintage',
        name: 'Vintage',
        style: 'Vintage Delicado',
        category: 'classico',
        description: 'Charme nostálgico com molduras ornamentadas e tipografia vitoriana. Uma viagem no tempo com elegância.',
        tags: ['Retrô', 'Delicado', 'Clássico'],
        image: '/images/templates/vintage.png',
    },
    {
        id: 'modern',
        name: 'Modern',
        style: 'Moderno Clean',
        category: 'moderno',
        description: 'Design contemporâneo com tipografia bold e layout assimétrico. Para casais fashion-forward e modernos.',
        tags: ['Minimalista', 'Bold', 'Editorial'],
        image: '/images/templates/modern.png',
        new: true,
    },
    {
        id: 'floral',
        name: 'Floral',
        style: 'Floral Aquarela',
        category: 'romantico',
        description: 'Ilustrações florais em aquarela com tons pastel delicados. Arte pintada à mão para casamentos românticos.',
        tags: ['Aquarela', 'Pastel', 'Artístico'],
        image: '/images/templates/floral.png',
    },
    {
        id: 'rustic',
        name: 'Rustic',
        style: 'Rústico Elegante',
        category: 'boho',
        description: 'Elementos naturais como eucalipto e texturas de madeira. Ideal para casamentos no campo ou em fazendas.',
        tags: ['Campo', 'Natural', 'Acolhedor'],
        image: '/images/templates/rustic.png',
    },
    {
        id: 'royal',
        name: 'Royal',
        style: 'Luxo Imperial',
        category: 'classico',
        description: 'Opulência majestosa com azul marinho profundo e detalhes em ouro. Para celebrações grandiosas e memoráveis.',
        tags: ['Imperial', 'Grandioso', 'Luxo'],
        image: '/images/templates/royal.png',
    },
];

export const categories = [
    { id: 'todos', label: 'Todos', count: templates.length },
    { id: 'classico', label: 'Clássico', count: templates.filter(t => t.category === 'classico').length },
    { id: 'moderno', label: 'Moderno', count: templates.filter(t => t.category === 'moderno').length },
    { id: 'minimalista', label: 'Minimalista', count: templates.filter(t => t.category === 'minimalista').length },
    { id: 'boho', label: 'Boho', count: templates.filter(t => t.category === 'boho').length },
    { id: 'romantico', label: 'Romântico', count: templates.filter(t => t.category === 'romantico').length },
];
