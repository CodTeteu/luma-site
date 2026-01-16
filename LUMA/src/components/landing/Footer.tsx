"use client";

import { siteConfig } from "@/config/site.config";

/**
 * Site footer with links and copyright.
 */
export function Footer() {
    return (
        <footer className="bg-[#1c2820] text-white/60 py-16 px-6 text-sm">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
                <div>
                    <span className="text-2xl text-white font-bold tracking-widest font-[family-name:var(--font-heading)]">
                        {siteConfig.name}
                    </span>
                    <p className="mt-4 max-w-xs">{siteConfig.description}</p>
                </div>
                <div className="flex gap-8">
                    <a href={siteConfig.contact.whatsapp.getUrl()} className="hover:text-[#C19B58]">
                        Fale Conosco
                    </a>
                    <a href={siteConfig.links.login} className="hover:text-[#C19B58]">
                        Área do Cliente
                    </a>
                    <a href={siteConfig.links.instagram} className="hover:text-[#C19B58]">
                        Instagram
                    </a>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center text-xs opacity-50">
                {siteConfig.footer.copyright}
            </div>
        </footer>
    );
}
