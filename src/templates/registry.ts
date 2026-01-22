/**
 * Template Registry
 * Maps template_id to template components
 */

import { ComponentType } from "react";
import { TemplateProps, TemplateInfo } from "./types";
import TemplateDefault from "./TemplateDefault";

// ============================================
// Template Components Map
// ============================================

const templates: Record<string, ComponentType<TemplateProps>> = {
    "default": TemplateDefault,
    "classic-elegance": TemplateDefault,  // For now, all use default
    // Add more templates here as they are created:
    // "modern-minimal": TemplateModern,
    // "romantic-garden": TemplateGarden,
};

// ============================================
// Template Info Registry
// ============================================

export const templateInfos: TemplateInfo[] = [
    {
        id: "default",
        name: "Clássico",
        description: "Design elegante e atemporal",
    },
    {
        id: "classic-elegance",
        name: "Classic Elegance",
        description: "Elegante e sofisticado",
    },
];

// ============================================
// Get Template Component
// ============================================

export function getTemplate(templateId: string): ComponentType<TemplateProps> {
    return templates[templateId] || TemplateDefault;
}

// ============================================
// Get Template Info
// ============================================

export function getTemplateInfo(templateId: string): TemplateInfo | undefined {
    return templateInfos.find(t => t.id === templateId);
}

// ============================================
// Export all
// ============================================

export { TemplateDefault };
export type { TemplateProps, TemplateInfo };
