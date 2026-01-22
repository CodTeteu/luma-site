/**
 * Template Types
 * Props and registry types for wedding invitation templates
 */

import { InvitationContent } from "@/types/invitation";

// ============================================
// Template Props
// ============================================

export interface TemplateProps {
    content: InvitationContent;
    isPreview?: boolean;  // True when rendering in editor preview
    slug?: string;        // Event slug for RSVP submission
}

// ============================================
// Template Info (for registry)
// ============================================

export interface TemplateInfo {
    id: string;
    name: string;
    description: string;
    thumbnail?: string;
}
