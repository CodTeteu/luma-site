"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Calendar,
    Users,
    Gift,
    Edit3,
    ExternalLink,
    CheckCircle2,
    Circle,
    ArrowRight,
    TrendingUp
} from "lucide-react";

// Mock data - would come from database
const WEDDING_DATE = new Date("2025-10-25");
const TODAY = new Date();
const DAYS_UNTIL_WEDDING = Math.ceil((WEDDING_DATE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24));

const stats = [
    {
        label: "Dias para o Grande Dia",
        value: DAYS_UNTIL_WEDDING.toString(),
        icon: Calendar,
        color: "text-[#C19B58]",
        bgColor: "bg-[#C19B58]/10"
    },
    {
        label: "Convidados Confirmados",
        value: "85",
        subValue: "de 120",
        icon: Users,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50"
    },
    {
        label: "Total em Presentes",
        value: "R$ 4.500",
        icon: Gift,
        color: "text-[#2A3B2E]",
        bgColor: "bg-[#2A3B2E]/5"
    },
];

const checklist = [
    { id: 1, label: "Preencher briefing inicial", done: true },
    { id: 2, label: "Editar foto de capa do site", done: true },
    { id: 3, label: "Cadastrar chave PIX para receber presentes", done: false },
    { id: 4, label: "Adicionar endereço da cerimônia", done: true },
    { id: 5, label: "Convidar os primeiros 10 convidados", done: false },
];

const recentActivity = [
    { id: 1, type: "rsvp", name: "Maria Silva", action: "confirmou presença", time: "há 2 horas" },
    { id: 2, type: "gift", name: "João Santos", action: "enviou um presente de R$ 200", time: "há 5 horas" },
    { id: 3, type: "rsvp", name: "Ana Oliveira", action: "confirmou presença (+1 acompanhante)", time: "ontem" },
    { id: 4, type: "message", name: "Carlos Lima", action: "deixou uma mensagem", time: "ontem" },
];

export default function DashboardOverview() {
    const completedTasks = checklist.filter(item => item.done).length;
    const progressPercentage = Math.round((completedTasks / checklist.length) * 100);

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                        Olá, Ana & Pedro
                    </h1>
                    <p className="text-[#6B7A6C] mt-1">
                        Bem-vindos ao painel do seu casamento.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/preview/template1"
                        target="_blank"
                        className="flex items-center gap-2 px-4 py-2.5 border border-[#DCD3C5] text-[#3E4A3F] text-sm font-medium rounded-lg hover:border-[#C19B58] hover:text-[#C19B58] transition-colors"
                    >
                        <ExternalLink size={16} />
                        Ver Site
                    </Link>
                    <Link
                        href="/editor/template1"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#2A3B2E] text-[#F7F5F0] text-sm font-medium rounded-lg hover:bg-[#1a261d] transition-colors shadow-lg shadow-[#2A3B2E]/10"
                    >
                        <Edit3 size={16} />
                        Editar Site
                    </Link>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-[#DCD3C5] hover:border-[#C19B58] transition-colors shadow-sm"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[#6B7A6C] text-xs uppercase tracking-wider mb-2">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                        {stat.value}
                                        {stat.subValue && (
                                            <span className="text-base text-[#6B7A6C] font-normal ml-1">
                                                {stat.subValue}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon size={20} className={stat.color} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* Progress & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Checklist */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                Preparativos
                            </h2>
                            <p className="text-sm text-[#6B7A6C]">
                                {completedTasks} de {checklist.length} tarefas concluídas
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-[#C19B58]" />
                            <span className="text-sm font-bold text-[#C19B58]">{progressPercentage}%</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#E5E0D6] rounded-full mb-6 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#C19B58] to-[#D4B56A] rounded-full"
                        />
                    </div>

                    {/* Checklist Items */}
                    <div className="space-y-3">
                        {checklist.map((item) => (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${item.done ? 'bg-emerald-50/50' : 'hover:bg-[#F7F5F0]'
                                    }`}
                            >
                                {item.done ? (
                                    <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <Circle size={20} className="text-[#DCD3C5] flex-shrink-0" />
                                )}
                                <span className={`text-sm ${item.done ? 'text-[#6B7A6C] line-through' : 'text-[#2A3B2E]'}`}>
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl border border-[#DCD3C5] p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                            Atividade Recente
                        </h2>
                        <Link
                            href="/dashboard/guests"
                            className="text-sm text-[#C19B58] hover:underline flex items-center gap-1"
                        >
                            Ver todos <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-[#DCD3C5]/50 last:border-0 last:pb-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activity.type === 'rsvp' ? 'bg-emerald-100 text-emerald-600' :
                                        activity.type === 'gift' ? 'bg-[#C19B58]/10 text-[#C19B58]' :
                                            'bg-[#2A3B2E]/5 text-[#2A3B2E]'
                                    }`}>
                                    {activity.type === 'rsvp' && <Users size={14} />}
                                    {activity.type === 'gift' && <Gift size={14} />}
                                    {activity.type === 'message' && <Edit3 size={14} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[#2A3B2E]">
                                        <span className="font-medium">{activity.name}</span>
                                        {" "}{activity.action}
                                    </p>
                                    <p className="text-xs text-[#6B7A6C] mt-0.5">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
