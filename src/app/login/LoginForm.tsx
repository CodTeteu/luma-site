"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const supabase = createClient();

        // If Supabase is not configured, use localStorage fallback (dev mode)
        if (!supabase) {
            console.warn("SUPABASE NOT CONFIGURED: Using localStorage fallback for auth");
            // Store basic user info in localStorage for dev purposes
            localStorage.setItem("luma_dev_user", JSON.stringify({ email, name, phone }));
            router.push("/dashboard");
            return;
        }

        try {
            if (isLogin) {
                // Login with email/password
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    if (error.message.includes("Invalid login")) {
                        setError("Email ou senha incorretos.");
                    } else if (error.message.includes("Email not confirmed")) {
                        setError("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
                    } else {
                        setError(error.message);
                    }
                    return;
                }

                // Success - redirect to dashboard
                router.push("/dashboard");
                router.refresh();
            } else {
                // Register new user
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            name,
                            phone,
                        },
                        emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
                    },
                });

                if (error) {
                    if (error.message.includes("already registered")) {
                        setError("Este email já está cadastrado. Faça login.");
                    } else {
                        setError(error.message);
                    }
                    return;
                }

                // Check if email confirmation is required
                // If user is not immediately logged in, email confirmation is enabled
                if (data.user && !data.session) {
                    // Email confirmation required - redirect to check-email page
                    router.push(`/login/check-email?email=${encodeURIComponent(email)}`);
                } else {
                    // No confirmation required - redirect to dashboard
                    router.push("/dashboard");
                    router.refresh();
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError("Ocorreu um erro. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[100dvh] w-full grid lg:grid-cols-2 bg-[#F7F5F0] overflow-hidden">
            {/* Left Column - Brand/Visual */}
            <div className="relative hidden lg:flex h-full overflow-hidden bg-[#2A3B2E] flex-col justify-between p-12 xl:p-16 text-[#F7F5F0]">
                {/* Texture Overlay */}
                <div
                    className="absolute inset-0 opacity-20 mix-blend-multiply"
                    style={{
                        backgroundImage: 'url(/images/assets/noise-texture.png)',
                        backgroundRepeat: 'repeat',
                        backgroundSize: '300px'
                    }}
                />

                {/* Organic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/" className="inline-flex items-center gap-2 group mb-8 opacity-70 hover:opacity-100 transition-opacity text-[#C19B58]">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Voltar para Home</span>
                    </Link>
                    <h1 className="text-4xl xl:text-5xl font-medium mb-4 xl:mb-6 font-[family-name:var(--font-heading)] leading-tight text-white">
                        Vamos planejar o <br />
                        <span className="text-[#C19B58] italic">grande dia?</span>
                    </h1>
                    <p className="text-base xl:text-lg text-[#F7F5F0]/90 max-w-md leading-relaxed">
                        Nossa Conciergerie Digital está pronta para criar o site e a identidade visual perfeita para vocês.
                    </p>
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="relative z-10 bg-[#F7F5F0]/5 backdrop-blur-md p-6 xl:p-8 rounded-2xl border border-[#F7F5F0]/10"
                >
                    <div className="flex gap-1 mb-4 text-[#C19B58]">
                        {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-base xl:text-lg font-serif italic mb-4">&quot;Adorei a facilidade. Só preenchi o briefing e a equipe me chamou no WhatsApp com tudo pronto.&quot;</p>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#C19B58]/20 flex items-center justify-center text-[#C19B58] font-bold">
                            C
                        </div>
                        <div>
                            <p className="font-medium text-[#F7F5F0]">Camila & Jorge</p>
                            <p className="text-xs text-[#F7F5F0]/60 uppercase tracking-wider">Noivos LUMA</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column - Form */}
            <div className="relative h-full flex items-center justify-center p-6 bg-noise overflow-hidden">
                {/* Leaf Shadow on light side too */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 rotate-90">
                        <Image src="/images/assets/leaf-shadow.png" alt="Shadow" fill className="object-contain" />
                    </div>
                </div>

                <div className="w-full max-w-md space-y-6 lg:space-y-8 relative z-10 scale-95 lg:scale-100 origin-center">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-medium text-[#2A3B2E] mb-2 font-[family-name:var(--font-heading)]">
                            {isLogin ? "Área do Casal" : "Iniciar Projeto"}
                        </h2>
                        <p className="text-[#6B7A6C]">
                            {isLogin ? "Acesse para ver o andamento." : "Preencha para liberar seu briefing."}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.form
                        key={isLogin ? "login" : "register"}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4 xl:space-y-6"
                        onSubmit={handleAuth}
                    >
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Nome</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-[#DCD3C5] bg-white/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E]"
                                        placeholder="Seu nome"
                                        required={!isLogin}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">WhatsApp</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-[#DCD3C5] bg-white/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E]"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#DCD3C5] bg-white/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E]"
                                placeholder="exemplo@email.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-[#2A3B2E] uppercase tracking-wider">Senha</label>
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const message = "Olá! Gostaria de recuperar minha senha do LUMA.";
                                            window.open(`https://wa.me/5551985367454?text=${encodeURIComponent(message)}`, "_blank");
                                        }}
                                        className="text-xs text-[#C19B58] hover:underline font-medium"
                                    >
                                        Esqueci minha senha
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-[#DCD3C5] bg-white/50 focus:border-[#C19B58] focus:ring-1 focus:ring-[#C19B58] outline-none transition-all text-[#2A3B2E]"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#2A3B2E] text-[#F7F5F0] py-3.5 xl:py-4 rounded-lg font-medium tracking-wide hover:bg-[#1f2d22] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#2A3B2E]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Aguarde...</span>
                                </>
                            ) : (
                                <>
                                    {isLogin ? "Acessar Projeto" : "Continuar para o Briefing"}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[#DCD3C5]/50"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#F7F5F0] text-[#6B7A6C]">Ou entre com</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 border border-[#DCD3C5] bg-white/50 rounded-lg hover:bg-white hover:border-[#C19B58] transition-colors text-sm font-medium text-[#3E4A3F] opacity-50 cursor-not-allowed"
                            disabled
                            title="Em breve"
                        >
                            Google
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 py-3 border border-[#DCD3C5] bg-white/50 rounded-lg hover:bg-white hover:border-[#C19B58] transition-colors text-sm font-medium text-[#3E4A3F] opacity-50 cursor-not-allowed"
                            disabled
                            title="Em breve"
                        >
                            Apple
                        </button>
                    </div>

                    <p className="text-center text-sm text-[#6B7A6C]">
                        {isLogin ? "Ainda não iniciou?" : "Já tem um projeto em andamento?"}{" "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="text-[#2A3B2E] font-medium hover:underline hover:text-[#C19B58] transition-colors"
                        >
                            {isLogin ? "Criar novo" : "Fazer login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
