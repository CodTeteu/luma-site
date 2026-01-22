import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase Admin client with SERVICE ROLE key.
 * This client bypasses RLS and should ONLY be used in server-side code.
 * NEVER import this in client components!
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY or SUPABASE_URL");
        return null;
    }

    return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
