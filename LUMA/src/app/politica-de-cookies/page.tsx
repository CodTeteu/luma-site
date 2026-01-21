import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Cookies | LUMA",
    description: "Informações sobre o uso de cookies na plataforma LUMA. Saiba como usamos cookies para melhorar sua experiência.",
    robots: "index, follow",
    alternates: {
        canonical: "https://luma.com.br/politica-de-cookies",
    },
};

export default function PoliticaDeCookies() {
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
                        <Cookie size={28} className="text-[#C19B58]" />
                        <h1 className="text-2xl md:text-3xl font-medium font-[family-name:var(--font-heading)]">
                            Política de Cookies
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
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">1. O que são Cookies?</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Cookies são pequenos arquivos de texto armazenados no seu navegador quando você
                            visita um site. Eles ajudam a lembrar suas preferências e a melhorar sua experiência.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">2. Como Usamos Cookies</h2>
                        <p className="text-[#3E4A3F] leading-relaxed mb-4">
                            A LUMA utiliza cookies para:
                        </p>
                        <ul className="list-disc pl-6 text-[#3E4A3F] space-y-2">
                            <li>Manter você conectado à sua conta</li>
                            <li>Lembrar suas preferências de personalização</li>
                            <li>Armazenar itens do carrinho de presentes</li>
                            <li>Analisar como nosso site é utilizado</li>
                            <li>Garantir a segurança da plataforma</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">3. Tipos de Cookies</h2>

                        <div className="bg-white rounded-lg border border-[#DCD3C5] p-6 mb-4">
                            <h3 className="font-medium text-[#2A3B2E] mb-2">🔒 Cookies Essenciais</h3>
                            <p className="text-[#6B7A6C] text-sm">
                                Necessários para o funcionamento do site. Não podem ser desativados.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg border border-[#DCD3C5] p-6 mb-4">
                            <h3 className="font-medium text-[#2A3B2E] mb-2">⚙️ Cookies de Preferências</h3>
                            <p className="text-[#6B7A6C] text-sm">
                                Lembram suas escolhas como idioma e tema do site.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg border border-[#DCD3C5] p-6 mb-4">
                            <h3 className="font-medium text-[#2A3B2E] mb-2">📊 Cookies Analíticos</h3>
                            <p className="text-[#6B7A6C] text-sm">
                                Nos ajudam a entender como os visitantes usam o site para melhorá-lo.
                            </p>
                        </div>

                        <div className="bg-white rounded-lg border border-[#DCD3C5] p-6">
                            <h3 className="font-medium text-[#2A3B2E] mb-2">🛒 Cookies de Sessão</h3>
                            <p className="text-[#6B7A6C] text-sm">
                                Mantêm informações temporárias como itens do carrinho de presentes.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">4. Cookies de Terceiros</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Podemos usar serviços de terceiros que colocam cookies no seu navegador:
                        </p>
                        <ul className="list-disc pl-6 mt-4 text-[#3E4A3F] space-y-2">
                            <li><strong>Google Analytics:</strong> Para análise de tráfego e comportamento</li>
                            <li><strong>Cloudflare:</strong> Para segurança e performance</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">5. Como Gerenciar Cookies</h2>
                        <p className="text-[#3E4A3F] leading-relaxed mb-4">
                            Você pode controlar cookies nas configurações do seu navegador:
                        </p>
                        <ul className="list-disc pl-6 text-[#3E4A3F] space-y-2">
                            <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                            <li><strong>Firefox:</strong> Configurações → Privacidade e Segurança</li>
                            <li><strong>Safari:</strong> Preferências → Privacidade</li>
                            <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
                        </ul>
                        <p className="text-[#6B7A6C] text-sm mt-4">
                            ⚠️ Desativar cookies pode afetar o funcionamento de algumas funcionalidades do site.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-xl font-medium text-[#2A3B2E] mb-4">6. Contato</h2>
                        <p className="text-[#3E4A3F] leading-relaxed">
                            Dúvidas sobre cookies? Entre em contato:
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
