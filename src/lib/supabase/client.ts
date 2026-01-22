import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for use in the browser.
 * This client is used in Client Components.
 */
export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        // Return null to signal that Supabase is not configured
        // Caller should handle fallback to localStorage
        return null;
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
    return !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
}
