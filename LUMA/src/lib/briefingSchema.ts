import { z } from "zod";

export const weddingStyles = [
    { value: "botanico", label: "🌿 Botânico", description: "Natureza, folhas verdes e frescor." },
    { value: "classico", label: "👑 Clássico", description: "Elegância atemporal e tradição." },
    { value: "rustico", label: "🌾 Rústico", description: "Madeira, tons quentes e acolhimento." },
    { value: "minimalista", label: "⚪ Minimalista", description: "Pureza, espaço e essencial." },
    { value: "moderno", label: "✨ Moderno", description: "Tendências, tipografia ousada e linhas limpas." },
    { value: "boho", label: "🍂 Boho Chic", description: "Despojado, cores terrosas e fluido." },
    { value: "praia", label: "🌊 Praia/Tropical", description: "Leveza, mar e pôr do sol." },
] as const;

export const pixKeyTypes = [
    { value: "cpf", label: "CPF" },
    { value: "celular", label: "Celular" },
    { value: "email", label: "E-mail" },
    { value: "aleatoria", label: "Chave Aleatória" },
] as const;

export const typographyOptions = [
    { value: "classica", label: "Clássica (Serifa)", fontName: "Playfair Display", description: "Sophisticated & Traditional" },
    { value: "moderna", label: "Moderna (Sans)", fontName: "Lato", description: "Clean & Contemporary" },
    { value: "romantica", label: "Romântica (Script)", fontName: "Great Vibes", description: "Elegant & Flowing" },
    { value: "vintage", label: "Vintage (Retro)", fontName: "Courier Prime", description: "Old School Charm" },
] as const;

export interface ColorPalette {
    value: string;
    label: string;
    colors: [string, string, string]; // Primary, Secondary, Background
}

export const colorPalettes: ColorPalette[] = [
    { value: "organic", label: "Organic Luxury", colors: ["#2A3B2E", "#C19B58", "#F7F5F0"] },
    { value: "classic", label: "Classic Gold", colors: ["#1A1A1A", "#D4AF37", "#FFFFFF"] },
    { value: "terracotta", label: "Boho Terracotta", colors: ["#A0522D", "#F5DEB3", "#FFF8E7"] },
    { value: "ocean", label: "Ocean Breeze", colors: ["#1E3A8A", "#60A5FA", "#EFF6FF"] },
    { value: "rose", label: "Romantic Rose", colors: ["#BE185D", "#FDA4AF", "#FFF1F2"] },
    { value: "lilac", label: "Soft Lilac", colors: ["#6D28D9", "#C4B5FD", "#F5F3FF"] },
];

// Step 1: O Casal e o Evento
export const step1Schema = z.object({
    brideName: z.string().min(2, "Nome da noiva deve ter pelo menos 2 caracteres"),
    groomName: z.string().min(2, "Nome do noivo deve ter pelo menos 2 caracteres"),
    weddingDate: z.string().min(1, "Data do casamento é obrigatória"),
    weddingTime: z.string().min(1, "Horário é obrigatório"),
    venueName: z.string().min(2, "Nome do local é obrigatório"),
    venueAddress: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
});

// Zod Enums
const weddingStyleEnum = z.enum(["botanico", "classico", "rustico", "minimalista", "moderno", "boho", "praia"]);
const typographyEnum = z.enum(["classica", "moderna", "romantica", "vintage"]);
const pixKeyTypeEnum = z.union([
    z.literal("cpf"),
    z.literal("celular"),
    z.literal("email"),
    z.literal("aleatoria"),
]);

// Step 2: Identidade Visual
export const step2Schema = z.object({
    weddingStyle: weddingStyleEnum,
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Cor inválida"),
    fontPreference: typographyEnum,
    colorPalette: z.string().optional(), // Store the palette ID as well
});

// Step 3: Lista de Presentes (PIX)
export const step3Schema = z.object({
    pixKeyType: pixKeyTypeEnum,
    pixKey: z.string().min(1, "Chave PIX é obrigatória"),
    pixHolderName: z.string().min(2, "Nome do titular é obrigatório"),
    pixBank: z.string().min(2, "Nome do banco é obrigatório"),
});

// Schema completo
export const briefingSchema = z.object({
    ...step1Schema.shape,
    ...step2Schema.shape,
    ...step3Schema.shape,
});

export type BriefingFormData = z.infer<typeof briefingSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

export type WeddingStyle = z.infer<typeof weddingStyleEnum>;
export type TypographyStyle = z.infer<typeof typographyEnum>;
export type PixKeyType = z.infer<typeof pixKeyTypeEnum>;

// Valores padrão do formulário
export const defaultBriefingValues: BriefingFormData = {
    brideName: "",
    groomName: "",
    weddingDate: "",
    weddingTime: "",
    venueName: "",
    venueAddress: "",
    weddingStyle: "classico",
    primaryColor: "#2A3B2E",
    secondaryColor: "#C19B58",
    backgroundColor: "#F7F5F0",
    fontPreference: "classica",
    colorPalette: "organic",
    pixKeyType: "cpf",
    pixKey: "",
    pixHolderName: "",
    pixBank: "",
};
