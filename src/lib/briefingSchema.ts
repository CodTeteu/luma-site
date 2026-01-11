import { z } from "zod";

export const weddingStyles = [
    { value: "botanico", label: "🌿 Botânico" },
    { value: "classico", label: "👑 Clássico" },
    { value: "rustico", label: "🌾 Rústico" },
    { value: "minimalista", label: "⚪ Minimalista" },
    { value: "moderno", label: "✨ Moderno" },
] as const;

export const pixKeyTypes = [
    { value: "cpf", label: "CPF" },
    { value: "celular", label: "Celular" },
    { value: "email", label: "E-mail" },
    { value: "aleatoria", label: "Chave Aleatória" },
] as const;

export const fontPreferences = [
    { value: "romantica", label: "Mais Cursiva / Romântica" },
    { value: "moderna", label: "Mais Moderna / Legível" },
] as const;

// Step 1: O Casal e o Evento
export const step1Schema = z.object({
    brideName: z.string().min(2, "Nome da noiva deve ter pelo menos 2 caracteres"),
    groomName: z.string().min(2, "Nome do noivo deve ter pelo menos 2 caracteres"),
    weddingDate: z.string().min(1, "Data do casamento é obrigatória"),
    weddingTime: z.string().min(1, "Horário é obrigatório"),
    venueName: z.string().min(2, "Nome do local é obrigatório"),
    venueAddress: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
});

// Zod v4 uses z.literal for enums or union of literals
const weddingStyleEnum = z.union([
    z.literal("botanico"),
    z.literal("classico"),
    z.literal("rustico"),
    z.literal("minimalista"),
    z.literal("moderno"),
]);

const fontPreferenceEnum = z.union([
    z.literal("romantica"),
    z.literal("moderna"),
]);

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
    fontPreference: fontPreferenceEnum,
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
export type FontPreference = z.infer<typeof fontPreferenceEnum>;
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
    primaryColor: "#C9A962",
    secondaryColor: "#E07A5F",
    backgroundColor: "#FDFBF7",
    fontPreference: "romantica",
    pixKeyType: "cpf",
    pixKey: "",
    pixHolderName: "",
    pixBank: "",
};
