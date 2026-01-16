"use client";

import { siteConfig } from "@/config/site.config";
import { Instagram, Smartphone, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Site footer with links and copyright.
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#121A15] text-white/60 py-12 px-6 text-sm relative border-t border-white/5">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C19B58]/30 to-transparent" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-10">
                {/* Brand Column */}
                <div className="space-y-4">
                    <span className="text-2xl text-white font-bold tracking-widest font-[family-name:var(--font-heading)] block">
                        {siteConfig.name}
                    </span>
                    <p className="leading-relaxed max-w-xs text-white/50 text-xs">
                        {siteConfig.description}. Tecnologia e design para casamentos inesquecíveis.
                    </p>
                    <div className="flex gap-3">
                        <SocialLink href={siteConfig.links.instagram} icon={<Instagram size={16} />} label="Instagram" />
                        <SocialLink href={siteConfig.contact.whatsapp.getUrl()} icon={<Smartphone size={16} />} label="WhatsApp" />
                        <SocialLink href="mailto:contato@luma.com" icon={<Mail size={16} />} label="Email" />
                    </div>
                </div>

                {/* Product Column */}
                <div>
                    <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-[10px] opacity-100">Produto</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#hero">Início</FooterLink>
                        <FooterLink href="#como-funciona">Como Funciona</FooterLink>
                        <FooterLink href="#funcionalidades">Funcionalidades</FooterLink>
                        <FooterLink href="#portfolio">Portfólio</FooterLink>
                        <FooterLink href="#parceiros">Para Parceiros</FooterLink>
                    </ul>
                </div>

                {/* Company Column */}
                <div>
                    <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-[10px] opacity-100">Empresa</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#">Sobre Nós</FooterLink>
                        <FooterLink href="#">Carreiras</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                        <FooterLink href="#">Imprensa</FooterLink>
                    </ul>
                </div>

                {/* Legal Column */}
                <div>
                    <h4 className="text-white font-medium mb-4 uppercase tracking-wider text-[10px] opacity-100">Legal</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#">Termos de Uso</FooterLink>
                        <FooterLink href="#">Política de Privacidade</FooterLink>
                        <FooterLink href="#">Política de Cookies</FooterLink>
                        <div className="pt-3 mt-3 border-t border-white/5">
                            <a
                                href={siteConfig.links.login}
                                className="inline-flex items-center gap-2 text-[#C19B58] hover:text-[#D4AF6A] transition-colors text-xs"
                            >
                                Área do Cliente <ArrowUpRight size={12} />
                            </a>
                        </div>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-[10px] opacity-40">
                <p>
                    © {currentYear} {siteConfig.name} Ltda. Todos os direitos reservados.
                </p>
                <p className="hidden md:block">
                    Feito com excelência para momentos únicos.
                </p>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <li>
            <Link href={href} className="hover:text-[#C19B58] transition-colors block w-fit text-xs">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#C19B58] hover:bg-white/10 transition-all"
            aria-label={label}
        >
            {icon}
        </a>
    );
}
