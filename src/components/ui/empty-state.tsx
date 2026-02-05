/**
 * Empty State Component
 * Consistent pattern for empty/no-data states
 */

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    secondaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    className?: string;
    compact?: boolean;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    secondaryAction,
    className,
    compact = false,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center",
                compact ? "py-8 px-4" : "py-16 px-6",
                className
            )}
        >
            {/* Icon */}
            {Icon && (
                <div className={cn(
                    "flex items-center justify-center rounded-full bg-[#F7F5F0] mb-4",
                    compact ? "w-12 h-12" : "w-16 h-16"
                )}>
                    <Icon
                        className={cn(
                            "text-[#C19B58]",
                            compact ? "w-5 h-5" : "w-7 h-7"
                        )}
                    />
                </div>
            )}

            {/* Title */}
            <h3 className={cn(
                "font-medium text-[#2A3B2E] mb-2",
                compact ? "text-base" : "text-xl"
            )}>
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p className={cn(
                    "text-[#6B7A6C] max-w-sm",
                    compact ? "text-sm mb-4" : "text-base mb-6"
                )}>
                    {description}
                </p>
            )}

            {/* Actions */}
            {(action || secondaryAction) && (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    {action && (
                        action.href ? (
                            <Button asChild variant="gold" size={compact ? "default" : "lg"}>
                                <Link href={action.href}>
                                    {action.label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="gold"
                                size={compact ? "default" : "lg"}
                                onClick={action.onClick}
                            >
                                {action.label}
                            </Button>
                        )
                    )}

                    {secondaryAction && (
                        secondaryAction.href ? (
                            <Button asChild variant="ghost" size={compact ? "default" : "lg"}>
                                <Link href={secondaryAction.href}>
                                    {secondaryAction.label}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size={compact ? "default" : "lg"}
                                onClick={secondaryAction.onClick}
                            >
                                {secondaryAction.label}
                            </Button>
                        )
                    )}
                </div>
            )}
        </div>
    );
}

// ============================================
// Preset Empty States
// ============================================

import { Inbox, Calendar, Users, Gift, Image, FileText } from "lucide-react";

export function NoEventsEmpty({ onCreateEvent }: { onCreateEvent?: () => void }) {
    return (
        <EmptyState
            icon={Calendar}
            title="Nenhum evento ainda"
            description="Crie seu primeiro convite digital e compartilhe com seus convidados."
            action={{
                label: "Criar convite grátis",
                onClick: onCreateEvent,
            }}
        />
    );
}

export function NoGuestsEmpty() {
    return (
        <EmptyState
            icon={Users}
            title="Nenhuma confirmação"
            description="Quando seus convidados confirmarem presença, eles aparecerão aqui."
            compact
        />
    );
}

export function NoGiftsEmpty({ onAddGift }: { onAddGift?: () => void }) {
    return (
        <EmptyState
            icon={Gift}
            title="Lista de presentes vazia"
            description="Adicione itens que você gostaria de receber dos seus convidados."
            action={{
                label: "Adicionar presente",
                onClick: onAddGift,
            }}
            compact
        />
    );
}

export function NoPhotosEmpty({ onUpload }: { onUpload?: () => void }) {
    return (
        <EmptyState
            icon={Image}
            title="Nenhuma foto ainda"
            description="Adicione suas melhores fotos para exibir na galeria do convite."
            action={{
                label: "Fazer upload",
                onClick: onUpload,
            }}
            compact
        />
    );
}

export function NotFoundEmpty() {
    return (
        <EmptyState
            icon={FileText}
            title="Página não encontrada"
            description="O conteúdo que você procura não existe ou foi removido."
            action={{
                label: "Voltar ao início",
                href: "/",
            }}
        />
    );
}

export function EmptyInbox() {
    return (
        <EmptyState
            icon={Inbox}
            title="Nada por aqui"
            description="Quando houver novidades, elas aparecerão aqui."
            compact
        />
    );
}
