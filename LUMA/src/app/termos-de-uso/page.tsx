import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso | LUMA",
    description: "Termos e condições de uso da plataforma LUMA para sites de casamento.",
    robots: "index, follow",
    alternates: {
        canonical: "https://luma.com.br/termos-de-uso",
    },
};

export default function TermosDeUso() {
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
                        <FileText size={28} className="text-[#C19B58]" />
                        <h1 className="text-2xl md:text-3xl font-medium font-[family-name:var(--font-heading)]">
                            Termos de Uso
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
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">1. Aceitação dos Termos</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Ao acessar e utilizar a plataforma LUMA, você concorda com estes Termos de Uso.
                            Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">2. Descrição do Serviço</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            A LUMA é uma plataforma de criação de sites exclusivos para casamentos, oferecendo:
                        </p>
                        <ul className="list-disc pl-6 mt-4 text-[#3E4A3F] space-y-2">
                            <li>Criação e personalização de sites de casamento</li>
                            <li>Sistema de confirmação de presença (RSVP)</li>
                            <li>Lista de presentes com pagamento via PIX</li>
                            <li>Mural de recados para convidados</li>
                            <li>Painel de gestão para os noivos</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">3. Cadastro e Conta</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Para utilizar nossos serviços, você deve criar uma conta fornecendo informações
                            verdadeiras e atualizadas. Você é responsável por manter a confidencialidade
                            de sua senha e por todas as atividades realizadas em sua conta.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">4. Pagamentos e Transações</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Os valores dos presentes são transferidos diretamente para a conta PIX cadastrada
                            pelos noivos. A LUMA não retém valores nem cobra taxas sobre as transações de presentes.
                            Os noivos são responsáveis por confirmar o recebimento dos pagamentos.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">5. Conteúdo do Usuário</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Você mantém todos os direitos sobre o conteúdo que publica (fotos, textos, etc.).
                            Ao publicar conteúdo, você nos concede uma licença para exibi-lo na plataforma.
                            Não é permitido publicar conteúdo ilegal, ofensivo ou que viole direitos de terceiros.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">6. Cancelamento</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Você pode cancelar sua conta a qualquer momento. Após o cancelamento, seu site
                            ficará indisponível e os dados serão removidos conforme nossa política de retenção.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">7. Limitação de Responsabilidade</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            A LUMA não se responsabiliza por transações financeiras entre convidados e noivos,
                            problemas técnicos fora de nosso controle, ou conteúdo publicado por terceiros.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">8. Contato</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Para dúvidas sobre estes termos, entre em contato pelo e-mail:
                            <a href="mailto:contato@luma.com.br" className="text-[#C19B58] hover:underline ml-1">
                                contato@luma.com.br
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
