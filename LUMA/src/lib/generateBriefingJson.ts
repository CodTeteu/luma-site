import { BriefingFormData } from "./briefingSchema";

interface BriefingJson {
    NOME_CASAL: string;
    DATA_EVENTO: string;
    HORARIO_EVENTO: string;
    LOCAL: {
        NOME: string;
        ENDERECO: string;
    };
    ESTILO_VISUAL: string;
    PALETA_CORES: {
        PRIMARY: string;
        SECONDARY: string;
        BACKGROUND: string;
        TEXT: string;
    };
    DADOS_PIX: {
        CHAVE: string;
        TIPO_CHAVE: string;
        NOME_TITULAR: string;
        BANCO: string;
    };
    FONTE_DESTAQUE: string;
    FONTE_TITULOS: string;
    FONTE_CORPO: string;
}

const styleLabels: Record<string, string> = {
    botanico: "Botânico",
    classico: "Clássico",
    rustico: "Rústico",
    minimalista: "Minimalista",
    moderno: "Moderno",
};

const pixKeyTypeLabels: Record<string, string> = {
    cpf: "CPF",
    celular: "Celular",
    email: "E-mail",
    aleatoria: "Chave Aleatória",
};

function formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export function generateBriefingJson(data: BriefingFormData): BriefingJson {
    // Determinar fontes baseado no estilo
    const isModernStyle = data.weddingStyle === "moderno" || data.weddingStyle === "minimalista";

    const fonts = isModernStyle
        ? {
            destaque: "Montserrat",
            titulos: "Montserrat",
            corpo: "Inter",
        }
        : {
            destaque: "Great Vibes",
            titulos: "Playfair Display",
            corpo: "Lato",
        };

    return {
        NOME_CASAL: `${data.brideName} & ${data.groomName}`,
        DATA_EVENTO: formatDate(data.weddingDate),
        HORARIO_EVENTO: data.weddingTime,
        LOCAL: {
            NOME: data.venueName,
            ENDERECO: data.venueAddress,
        },
        ESTILO_VISUAL: styleLabels[data.weddingStyle] || data.weddingStyle,
        PALETA_CORES: {
            PRIMARY: data.primaryColor,
            SECONDARY: data.secondaryColor,
            BACKGROUND: data.backgroundColor,
            TEXT: "#333333",
        },
        DADOS_PIX: {
            CHAVE: data.pixKey,
            TIPO_CHAVE: pixKeyTypeLabels[data.pixKeyType] || data.pixKeyType,
            NOME_TITULAR: data.pixHolderName,
            BANCO: data.pixBank,
        },
        FONTE_DESTAQUE: fonts.destaque,
        FONTE_TITULOS: fonts.titulos,
        FONTE_CORPO: fonts.corpo,
    };
}

export function copyToClipboard(text: string): Promise<boolean> {
    return navigator.clipboard
        .writeText(text)
        .then(() => true)
        .catch(() => false);
}
