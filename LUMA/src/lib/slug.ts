/**
 * Slug Utilities
 * Functions for validating, normalizing, and generating unique slugs
 */

import type { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Reserved Slugs
// ============================================

/**
 * List of reserved slugs that cannot be used for events.
 * These are routes, static files, or system paths.
 */
export const RESERVED_SLUGS = [
    // App routes
    "login",
    "dashboard",
    "templates",
    "preview",
    "api",
    "admin",
    "settings",
    "editor",
    "guests",
    "financial",

    // Static files and Next.js internals
    "images",
    "_next",
    "favicon",
    "favicon.ico",
    "robots",
    "robots.txt",
    "sitemap",
    "sitemap.xml",

    // Legal pages
    "terms",
    "termos",
    "termos-de-uso",
    "privacy",
    "privacidade",
    "politica-de-privacidade",
    "cookies",
    "politica-de-cookies",

    // Common reserved words
    "www",
    "app",
    "help",
    "support",
    "about",
    "contact",
    "blog",
    "news",
    "home",
    "index",
    "null",
    "undefined",
    "test",
    "demo",
] as const;

// ============================================
// Validation Functions
// ============================================

/**
 * Check if a slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
    const normalized = slug.toLowerCase().trim();
    return RESERVED_SLUGS.includes(normalized as typeof RESERVED_SLUGS[number]);
}

/**
 * Validate slug format
 * Returns error message if invalid, null if valid
 */
export function validateSlug(slug: string): string | null {
    if (!slug || slug.trim().length === 0) {
        return "Slug não pode estar vazio";
    }

    if (slug.length < 3) {
        return "Slug deve ter pelo menos 3 caracteres";
    }

    if (slug.length > 100) {
        return "Slug deve ter no máximo 100 caracteres";
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
        return "Slug deve conter apenas letras minúsculas, números e hífens";
    }

    if (slug.startsWith("-") || slug.endsWith("-")) {
        return "Slug não pode começar ou terminar com hífen";
    }

    if (slug.includes("--")) {
        return "Slug não pode conter hífens consecutivos";
    }

    if (isReservedSlug(slug)) {
        return "Este slug é reservado. Escolha outro nome.";
    }

    return null;
}

// ============================================
// Normalization Functions
// ============================================

/**
 * Normalize a string to a valid slug format
 * - Lowercase
 * - Remove accents/diacritics
 * - Replace spaces with hyphens
 * - Remove invalid characters
 * - Remove leading/trailing hyphens
 * - Collapse multiple hyphens
 */
export function normalizeSlug(input: string): string {
    if (!input) return "";

    return input
        .toLowerCase()
        .trim()
        // Remove accents/diacritics
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, "-")
        // Remove invalid characters (keep only a-z, 0-9, -)
        .replace(/[^a-z0-9-]/g, "")
        // Collapse multiple hyphens
        .replace(/-+/g, "-")
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, "");
}

// ============================================
// Unique Slug Generation
// ============================================

/**
 * Generate a random suffix for slug collision handling
 */
function generateSuffix(): string {
    return Math.random().toString(36).substring(2, 6);
}

/**
 * Generate a unique slug that doesn't exist in the database
 * 
 * @param baseSlug - The base slug to start with (will be normalized)
 * @param supabase - Supabase client instance
 * @param maxAttempts - Maximum number of attempts to find unique slug
 * @returns Unique slug or null if couldn't generate
 */
export async function generateUniqueSlug(
    baseSlug: string,
    supabase: SupabaseClient,
    maxAttempts = 10
): Promise<string | null> {
    let slug = normalizeSlug(baseSlug);

    // If normalized slug is too short, use a default
    if (slug.length < 3) {
        slug = "evento";
    }

    // If slug is reserved, add suffix immediately
    if (isReservedSlug(slug)) {
        slug = `${slug}-${generateSuffix()}`;
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check if slug exists
        const { data, error } = await supabase
            .from("events")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            console.error("Error checking slug:", error);
            return null;
        }

        // Slug is available!
        if (!data) {
            return slug;
        }

        // Slug exists, add suffix and try again
        const basePart = normalizeSlug(baseSlug).length >= 3
            ? normalizeSlug(baseSlug)
            : "evento";
        slug = `${basePart}-${generateSuffix()}`;
    }

    // Couldn't find unique slug after max attempts
    console.error(`Could not generate unique slug after ${maxAttempts} attempts`);
    return null;
}

/**
 * Generate slug from couple names
 */
export function generateSlugFromNames(brideName: string, groomName: string): string {
    const bride = normalizeSlug(brideName || "");
    const groom = normalizeSlug(groomName || "");

    // If both names are empty, return empty (will use temporary slug)
    if (!bride && !groom) {
        return "";
    }

    // Combine names
    let base = [bride, groom].filter(Boolean).join("-");

    // If too short, return empty
    if (base.length < 3) {
        return "";
    }

    return base;
}

/**
 * Generate a temporary slug for events without names yet
 */
export function generateTemporarySlug(): string {
    const suffix = Math.random().toString(36).substring(2, 8);
    return `evento-${suffix}`;
}

/**
 * Check if a slug is temporary/legacy and should be updated
 * Returns true if the slug can be improved with real names
 */
export function isTemporarySlug(slug: string): boolean {
    if (!slug) return true;

    // Temporary patterns
    const temporaryPatterns = [
        /^evento-[a-z0-9]+$/,         // evento-xxxx
        /^noiva-noivo(-[a-z0-9]+)?$/, // noiva-noivo or noiva-noivo-xxxx
        /^casamento(-[a-z0-9]+)?$/,   // casamento or casamento-xxxx
    ];

    return temporaryPatterns.some(pattern => pattern.test(slug));
}

