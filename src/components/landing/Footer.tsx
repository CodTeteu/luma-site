"use client";

import { siteConfig } from "@/config/site.config";
import { Instagram, Smartphone, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";

/**
 * Site footer with links and copyright - Mobile optimized.
 */
export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#121A15] text-white/80 py-10 md:py-12 px-4 md:px-6 text-sm relative border-t border-white/5">
            {/* Decorative top gradient */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C19B58]/30 to-transparent" />

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-10">
                {/* Brand Column - Full width on mobile */}
                <div className="col-span-2 md:col-span-1 space-y-3 md:space-y-4">
                    <span className="text-xl md:text-2xl text-white font-bold tracking-widest font-[family-name:var(--font-heading)] block">
                        {siteConfig.name}
                    </span>
                    <p className="leading-relaxed max-w-xs text-white/70 text-xs">
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
                    <h4 className="text-white/95 font-medium mb-3 md:mb-4 uppercase tracking-wider text-[10px] opacity-100">Produto</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#hero">Início</FooterLink>
                        <FooterLink href="#como-funciona">Como Funciona</FooterLink>
                        <FooterLink href="#funcionalidades">Funcionalidades</FooterLink>
                        <FooterLink href="#portfolio">Portfólio</FooterLink>
                    </ul>
                </div>

                {/* Company Column - Hidden on smallest mobile */}
                <div className="hidden sm:block">
                    <h4 className="text-white/95 font-medium mb-3 md:mb-4 uppercase tracking-wider text-[10px] opacity-100">Empresa</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#">Sobre Nós</FooterLink>
                        <FooterLink href="#">Carreiras</FooterLink>
                        <FooterLink href="#">Blog</FooterLink>
                        <FooterLink href="#">Imprensa</FooterLink>
                    </ul>
                </div>

                {/* Legal Column */}
                <div>
                    <h4 className="text-white/95 font-medium mb-3 md:mb-4 uppercase tracking-wider text-[10px] opacity-100">Legal</h4>
                    <ul className="space-y-2">
                        <FooterLink href="#">Termos de Uso</FooterLink>
                        <FooterLink href="#">Privacidade</FooterLink>
                        <FooterLink href="#">Cookies</FooterLink>
                        <div className="pt-2 md:pt-3 mt-2 md:mt-3 border-t border-white/5">
                            <Link
                                href={siteConfig.links.login}
                                className="inline-flex items-center gap-2 text-[#EAD1A2] hover:text-[#C19B58] transition-colors text-xs py-1"
                            >
                                Área do Cliente <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-5 md:pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-3 text-[10px] opacity-70 text-center md:text-left">
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
            <Link href={href} className="hover:text-[#C19B58] transition-colors block w-fit text-xs py-1 active:text-[#C19B58]">
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-white/5 flex items-center justify-center text-white/80 hover:text-[#C19B58] hover:bg-white/10 transition-all active:bg-white/15"
            aria-label={label}
        >
            {icon}
        </Link>
    );
}
