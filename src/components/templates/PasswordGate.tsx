/**
 * Password Gate Component
 * Protects Plus/Concierge invites with password
 */

"use client";

import { useState } from "react";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";

interface PasswordGateProps {
    slug: string;
    onSuccess: () => void;
}

export function PasswordGate({ slug, onSuccess }: PasswordGateProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsSubmitting(true);
        setError("");

        try {
            const response = await fetch("/api/invite/verify-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Senha incorreta");
            }

            // Password correct - callback to parent
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Senha incorreta");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F5F0] p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#C19B58]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-[#C19B58]" />
                        </div>
                        <h1 className="text-2xl font-medium text-[#2A3B2E] mb-2">
                            Convite Protegido
                        </h1>
                        <p className="text-[#6B7A6C]">
                            Este convite requer uma senha para visualização.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#2A3B2E] mb-2">
                                Senha do convite
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite a senha"
                                    className="w-full p-4 pr-12 border border-[#E5E1D8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C19B58]/50"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7A6C] hover:text-[#2A3B2E]"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !password.trim()}
                            className="w-full py-4 bg-[#C19B58] text-white rounded-lg hover:bg-[#A88347] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                "Acessar convite"
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-[#A5B5A7] text-center mt-6">
                        A senha foi enviada pelos anfitriões.
                        <br />
                        Entre em contato com eles se você não a possui.
                    </p>
                </div>
            </div>
        </div>
    );
}
