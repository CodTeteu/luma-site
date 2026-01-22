import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade | LUMA",
    description: "Política de privacidade e proteção de dados da plataforma LUMA. Em conformidade com a LGPD.",
    robots: "index, follow",
    alternates: {
        canonical: "https://luma.com.br/politica-de-privacidade",
    },
};

export default function PoliticaDePrivacidade() {
    return (
        <div className="min-h-screen bg-[#F7F5F0]">
            {/* Header */}
            <header className="bg-[#2A3B2E] text-white py-6">
                <div className="max-w-4xl mx-auto px-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao início
                    </Link>
                    <div className="flex items-center gap-3">
                        <Shield size={28} className="text-[#C19B58]" />
                        <h1 className="text-2xl md:text-3xl font-medium font-[family-name:var(--font-heading)]">
                            Política de Privacidade
                        </h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-stone max-w-none">
                    <p className="text-[#6B7A6C] mb-8">
                        Última atualização: Janeiro de 2026
                    </p>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">1. Introdução</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            A LUMA está comprometida com a proteção da sua privacidade. Esta política
                            descreve como coletamos, usamos e protegemos suas informações pessoais,
                            em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">2. Dados Coletados</h2>
                        <p className="text-[#3E4A3F] leading-relaxed mb-4">
                            Coletamos os seguintes tipos de dados:
                        </p>
                        <ul className="list-disc pl-6 text-[#3E4A3F] space-y-2">
                            <li><strong>Dados de cadastro:</strong> Nome, e-mail, telefone, data do casamento</li>
                            <li><strong>Dados do site:</strong> Fotos, textos, informações do evento</li>
                            <li><strong>Dados de convidados:</strong> Nome, telefone, confirmação de presença</li>
                            <li><strong>Dados financeiros:</strong> Chave PIX, registros de presentes recebidos</li>
                            <li><strong>Dados de navegação:</strong> IP, cookies, logs de acesso</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">3. Uso dos Dados</h2>
                        <p className="text-[#3E4A3F] leading-relaxed mb-4">
                            Utilizamos seus dados para:
                        </p>
                        <ul className="list-disc pl-6 text-[#3E4A3F] space-y-2">
                            <li>Fornecer e manter nossos serviços</li>
                            <li>Personalizar sua experiência na plataforma</li>
                            <li>Processar confirmações de presença e lista de presentes</li>
                            <li>Enviar comunicações importantes sobre o serviço</li>
                            <li>Melhorar a segurança e prevenir fraudes</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">4. Compartilhamento de Dados</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Não vendemos seus dados. Compartilhamos informações apenas:
                        </p>
                        <ul className="list-disc pl-6 mt-4 text-[#3E4A3F] space-y-2">
                            <li>Com os convidados que acessam seu site de casamento (informações públicas)</li>
                            <li>Com prestadores de serviço essenciais (hospedagem, e-mail)</li>
                            <li>Quando exigido por lei ou ordem judicial</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">5. Armazenamento e Segurança</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Seus dados são armazenados em servidores seguros com criptografia.
                            Adotamos medidas técnicas e organizacionais para proteger suas informações
                            contra acesso não autorizado, perda ou destruição.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">6. Seus Direitos (LGPD)</h2>
                        <p className="text-[#3E4A3F] leading-relaxed mb-4">
                            Você tem direito a:
                        </p>
                        <ul className="list-disc pl-6 text-[#3E4A3F] space-y-2">
                            <li>Acessar seus dados pessoais</li>
                            <li>Corrigir dados incompletos ou desatualizados</li>
                            <li>Solicitar a exclusão de seus dados</li>
                            <li>Revogar consentimento a qualquer momento</li>
                            <li>Solicitar portabilidade dos dados</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">7. Retenção de Dados</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento,
                            os dados são removidos em até 30 dias, exceto quando a retenção for necessária
                            para cumprimento de obrigações legais.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">8. Contato do DPO</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Para exercer seus direitos ou esclarecer dúvidas sobre privacidade,
                            entre em contato com nosso Encarregado de Proteção de Dados:
                            <a href="mailto:privacidade@luma.com.br" className="text-[#C19B58] hover:underline ml-1">
                                privacidade@luma.com.br
                            </a>
                        </p>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#2A3B2E] text-white/60 py-6 text-center text-sm">
                <p>&copy; 2026 LUMA. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
