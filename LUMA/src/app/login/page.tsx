
import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
    title: "Login | LUMA - Área do Cliente",
    description: "Acesse sua conta LUMA para gerenciar seu site de casamento, acompanhar o RSVP e visualizar presentes recebidos.",
    robots: "index, follow",
    alternates: {
        canonical: "https://luma.com.br/login",
    },
};

export default function LoginPage() {
    return <LoginForm />;
}
