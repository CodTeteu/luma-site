/**
 * Server-side Plan Enforcement
 * Use these functions in API routes to enforce plan limits
 */

import { SupabaseClient } from '@supabase/supabase-js';
import {
    PlanType,
    checkPhotosLimit,
    checkRSVPLimit,
    checkGiftsLimit,
    LimitCheckResult,
    PLAN_FEATURES
} from './index';

// ============================================
// Types
// ============================================

export interface EventPlanInfo {
    id: string;
    plan: PlanType;
    event_type: string;
    status: string;
    expires_at: string | null;
}

// ============================================
// Fetch Event Plan Info
// ============================================

export async function getEventPlanInfo(
    supabase: SupabaseClient,
    eventId: string
): Promise<EventPlanInfo | null> {
    const { data, error } = await supabase
        .from('events')
        .select('id, plan, event_type, status, expires_at')
        .eq('id', eventId)
        .single();

    if (error || !data) {
        return null;
    }

    return {
        id: data.id,
        plan: (data.plan || 'free') as PlanType,
        event_type: data.event_type || 'wedding',
        status: data.status,
        expires_at: data.expires_at,
    };
}

// ============================================
// Count Resources
// ============================================

export async function countEventRSVPs(
    supabase: SupabaseClient,
    eventId: string
): Promise<number> {
    const { count, error } = await supabase
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

    if (error) {
        console.error('[Enforcement] Error counting RSVPs:', error);
        return 0;
    }

    return count || 0;
}

export async function countEventPhotos(
    supabase: SupabaseClient,
    eventId: string
): Promise<number> {
    const { count, error } = await supabase
        .from('assets')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('asset_type', 'photo')
        .eq('is_active', true);

    if (error) {
        console.error('[Enforcement] Error counting photos:', error);
        return 0;
    }

    return count || 0;
}

export async function countEventGifts(
    supabase: SupabaseClient,
    eventId: string
): Promise<number> {
    const { count, error } = await supabase
        .from('gifts')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('is_active', true);

    if (error) {
        console.error('[Enforcement] Error counting gifts:', error);
        return 0;
    }

    return count || 0;
}

// ============================================
// Enforcement Functions
// ============================================

export async function enforceRSVPLimit(
    supabase: SupabaseClient,
    eventId: string
): Promise<LimitCheckResult> {
    const planInfo = await getEventPlanInfo(supabase, eventId);
    if (!planInfo) {
        return {
            allowed: false,
            current: 0,
            limit: 0,
            remaining: 0,
            message: 'Evento não encontrado',
        };
    }

    const currentCount = await countEventRSVPs(supabase, eventId);
    return checkRSVPLimit(planInfo.plan, currentCount);
}

export async function enforcePhotosLimit(
    supabase: SupabaseClient,
    eventId: string
): Promise<LimitCheckResult> {
    const planInfo = await getEventPlanInfo(supabase, eventId);
    if (!planInfo) {
        return {
            allowed: false,
            current: 0,
            limit: 0,
            remaining: 0,
            message: 'Evento não encontrado',
        };
    }

    const currentCount = await countEventPhotos(supabase, eventId);
    return checkPhotosLimit(planInfo.plan, currentCount);
}

export async function enforceGiftsLimit(
    supabase: SupabaseClient,
    eventId: string
): Promise<LimitCheckResult> {
    const planInfo = await getEventPlanInfo(supabase, eventId);
    if (!planInfo) {
        return {
            allowed: false,
            current: 0,
            limit: 0,
            remaining: 0,
            message: 'Evento não encontrado',
        };
    }

    const currentCount = await countEventGifts(supabase, eventId);
    return checkGiftsLimit(planInfo.plan, currentCount);
}

// ============================================
// Feature Checks
// ============================================

export function canExportCSV(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].canExportCSV;
}

export function canSetPassword(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].canSetPassword;
}

export function hasWatermark(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].hasWatermark;
}

export function hasPremiumTemplates(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].hasPremiumTemplates;
}

// ============================================
// Expiration Check
// ============================================

export function isEventExpired(expiresAt: string | null): boolean {
    if (!expiresAt) {
        return false;
    }
    return new Date(expiresAt) < new Date();
}

export async function checkEventAccess(
    supabase: SupabaseClient,
    eventId: string
): Promise<{ allowed: boolean; reason?: string }> {
    const planInfo = await getEventPlanInfo(supabase, eventId);

    if (!planInfo) {
        return { allowed: false, reason: 'Evento não encontrado' };
    }

    if (planInfo.status !== 'published') {
        return { allowed: false, reason: 'Evento não publicado' };
    }

    if (isEventExpired(planInfo.expires_at)) {
        return { allowed: false, reason: 'Link expirado' };
    }

    return { allowed: true };
}
