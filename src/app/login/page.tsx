"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Github, Chrome, ArrowRight, Music, AlertCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, validation and auth logic here
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-[#fdfcfa]">
            {/* Left Column - Brand/Visual */}
            <div className="relative hidden lg:block overflow-hidden bg-[#1a3c34]">
                <div
                    className="absolute inset-0 opacity-40 mix-blend-multiply"
                    style={{
                        backgroundImage: 'url(/background-luma.png)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                <div className="relative z-10 h-full flex flex-col justify-between p-16 text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <a href="/" className="inline-flex items-center gap-2 group mb-8 opacity-80 hover:opacity-100 transition-opacity">
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Voltar para Home</span>
                        </a>
                        <h1 className="text-5xl font-medium mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
                            Comece sua jornada <br />
                            <span className="text-[var(--gold)] italic">inesquecível.</span>
                        </h1>
                        <p className="text-lg text-gray-300 max-w-md leading-relaxed">
                            Junte-se a centenas de casais que transformaram a organização do casamento em uma experiência digital única.
                        </p>
                    </motion.div>

                    {/* Testimonial */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10"
                    >
                        <div className="flex gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-[var(--gold)]">★</span>)}
                        </div>
                        <p className="text-lg font-serif italic mb-4">"A melhor decisão que tomamos para o nosso casamento. O RSVP pelo WhatsApp facilitou tudo!"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-300" />
                            <div>
                                <p className="font-medium">Mariana & Lucas</p>
                                <p className="text-xs text-gray-400 uppercase tracking-wider">Casados em 2024</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="relative flex items-center justify-center p-6 lg:p-20">
                <div className="w-full max-w-md space-y-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-medium text-[#1a3c34] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                            {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin ? "Entre para gerenciar seu site." : "Comece grátis hoje mesmo."}
                        </p>
                    </div>

                    <motion.form
                        key={isLogin ? "login" : "register"}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                        onSubmit={handleAuth}
                    >
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Nome</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all" placeholder="Seu nome" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">WhatsApp</label>
                                    <input type="tel" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all" placeholder="(11) 99999-9999" />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">E-mail</label>
                            <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all" placeholder="exemplo@email.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Senha</label>
                            <input type="password" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)] outline-none transition-all" placeholder="••••••••" />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1a3c34] text-white py-4 rounded-lg font-medium tracking-wide hover:bg-[#2a5c4e] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLogin ? "Entrar" : "Criar Conta Grátis"}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#fdfcfa] text-gray-400">Ou continue com</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors text-sm font-medium text-gray-600">
                            <Chrome size={18} />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-lg hover:bg-white hover:border-gray-300 transition-colors text-sm font-medium text-gray-600">
                            <Github size={18} />
                            GitHub
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#1a3c34] font-medium hover:underline"
                        >
                            {isLogin ? "Cadastre-se" : "Faça login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
