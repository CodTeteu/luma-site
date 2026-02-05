"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Home,
    Users,
    Wallet,
    Settings,
    LogOut,
    Menu,
    X,
    Heart,
    Loader2,
    Pencil,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useBriefing } from "@/contexts/BriefingContext";

const navItems = [
    { href: "/dashboard", label: "Visão Geral", icon: Home },
    { href: "/dashboard/events", label: "Eventos", icon: Calendar },
    { href: "/dashboard/editor", label: "Editor", icon: Pencil },
    { href: "/dashboard/guests", label: "Convidados", icon: Users },
    { href: "/dashboard/financial", label: "Financeiro", icon: Wallet },
    { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

interface SidebarProps {
    userName?: string;
}

export default function Sidebar() {
    const { briefingData } = useBriefing();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const supabase = createClient();

        if (supabase) {
            await supabase.auth.signOut();
        }

        // Clear any localStorage data
        localStorage.removeItem("luma_briefing_data");
        localStorage.removeItem("luma_dev_user");

        router.push("/login");
        router.refresh();
    };

    const NavContent = () => (
        <>
            {/* Logo */}
            <div className="p-8">
                <Link href="/dashboard" className="block">
                    <span className="text-2xl font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        LUMA
                    </span>
                </Link>
            </div>

            {/* User Info */}
            <div className="px-6 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-[#E5E0D6]/50">
                    <div className="w-10 h-10 rounded-full bg-[#C19B58]/20 text-[#C19B58] flex items-center justify-center">
                        <Heart size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2A3B2E] truncate">
                            {briefingData?.brideName || "Novo Evento"}
                            {briefingData?.eventType !== "graduation" && briefingData?.groomName && ` & ${briefingData.groomName}`}
                        </p>
                        <p className="text-[10px] text-[#6B7A6C] uppercase tracking-wider">
                            {briefingData?.eventType === "graduation" ? "Sua Formatura" : "Seu Casamento"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                active
                                    ? "bg-[#2A3B2E] text-[#F7F5F0] shadow-md shadow-[#2A3B2E]/10"
                                    : "text-[#3E4A3F] hover:bg-[#E5E0D6] hover:text-[#2A3B2E]"
                            )}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-[#DCD3C5]">
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7A6C] hover:text-[#9B2C2C] hover:bg-red-50 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                    {isLoggingOut ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <LogOut size={18} />
                    )}
                    {isLoggingOut ? "Saindo..." : "Sair"}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F7F5F0] border-r border-[#DCD3C5] hidden md:flex md:flex-col z-30">
                <NavContent />
            </aside>

            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-[#F7F5F0] border-b border-[#DCD3C5] flex items-center justify-between px-4 md:hidden z-30">
                <Link href="/dashboard">
                    <span className="text-xl font-bold tracking-widest text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        LUMA
                    </span>
                </Link>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2 rounded-lg hover:bg-[#E5E0D6] text-[#3E4A3F] transition-colors"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-72 bg-[#F7F5F0] z-50 flex flex-col shadow-2xl md:hidden"
                        >
                            <NavContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
