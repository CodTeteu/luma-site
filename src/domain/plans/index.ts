/**
 * LUMA Plan Limits & Configuration
 * Centralized plan definitions and limit enforcement
 */

// ============================================
// Types
// ============================================

export type PlanType = 'free' | 'plus' | 'concierge';
export type EventType = 'wedding' | 'graduation';

export interface PlanLimits {
    photos: number;
    rsvps: number;
    gifts: number;
    templates: number;
}

export interface PlanFeatures {
    hasWatermark: boolean;
    canExportCSV: boolean;
    canSetPassword: boolean;
    hasPremiumTemplates: boolean;
    hasPrioritySupport: boolean;
    linkDurationMonths: number;
}

export interface PlanInfo {
    id: PlanType;
    name: string;
    price: number;
    priceLabel: string;
    limits: PlanLimits;
    features: PlanFeatures;
}

// ============================================
// Plan Configuration (Source of Truth)
// ============================================

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    free: {
        photos: 10,
        rsvps: 50,
        gifts: 10,
        templates: 2,
    },
    plus: {
        photos: 30,
        rsvps: Infinity,
        gifts: Infinity,
        templates: Infinity,
    },
    concierge: {
        photos: 60,
        rsvps: Infinity,
        gifts: Infinity,
        templates: Infinity,
    },
};

export const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
    free: {
        hasWatermark: true,
        canExportCSV: false,
        canSetPassword: false,
        hasPremiumTemplates: false,
        hasPrioritySupport: false,
        linkDurationMonths: 1, // 30 days after event
    },
    plus: {
        hasWatermark: false,
        canExportCSV: true,
        canSetPassword: true,
        hasPremiumTemplates: true,
        hasPrioritySupport: true,
        linkDurationMonths: 12,
    },
    concierge: {
        hasWatermark: false,
        canExportCSV: true,
        canSetPassword: true,
        hasPremiumTemplates: true,
        hasPrioritySupport: true,
        linkDurationMonths: 12,
    },
};

export const PLANS: Record<PlanType, PlanInfo> = {
    free: {
        id: 'free',
        name: 'Grátis',
        price: 0,
        priceLabel: 'R$ 0',
        limits: PLAN_LIMITS.free,
        features: PLAN_FEATURES.free,
    },
    plus: {
        id: 'plus',
        name: 'Plus',
        price: 97,
        priceLabel: 'R$ 97',
        limits: PLAN_LIMITS.plus,
        features: PLAN_FEATURES.plus,
    },
    concierge: {
        id: 'concierge',
        name: 'Concierge',
        price: 297,
        priceLabel: 'R$ 297',
        limits: PLAN_LIMITS.concierge,
        features: PLAN_FEATURES.concierge,
    },
};

// ============================================
// Limit Checking Utilities
// ============================================

export interface LimitCheckResult {
    allowed: boolean;
    current: number;
    limit: number;
    remaining: number;
    message?: string;
}

export function checkLimit(
    current: number,
    limit: number,
    resourceName: string
): LimitCheckResult {
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - current);
    const allowed = current < limit;

    return {
        allowed,
        current,
        limit,
        remaining,
        message: allowed
            ? undefined
            : `Limite de ${resourceName} atingido (${current}/${limit === Infinity ? '∞' : limit})`,
    };
}

export function checkPhotosLimit(plan: PlanType, currentCount: number): LimitCheckResult {
    return checkLimit(currentCount, PLAN_LIMITS[plan].photos, 'fotos');
}

export function checkRSVPLimit(plan: PlanType, currentCount: number): LimitCheckResult {
    return checkLimit(currentCount, PLAN_LIMITS[plan].rsvps, 'confirmações');
}

export function checkGiftsLimit(plan: PlanType, currentCount: number): LimitCheckResult {
    return checkLimit(currentCount, PLAN_LIMITS[plan].gifts, 'itens de presente');
}

// ============================================
// Plan Comparison & Upgrade
// ============================================

export function isPlanUpgrade(from: PlanType, to: PlanType): boolean {
    const ranking: Record<PlanType, number> = {
        free: 0,
        plus: 1,
        concierge: 2,
    };
    return ranking[to] > ranking[from];
}

export function getUpgradePrice(from: PlanType, to: PlanType): number {
    // For now, just return the full price of the target plan
    // In future, could implement prorated pricing
    return PLANS[to].price;
}

export function getPlanById(id: string): PlanInfo | undefined {
    if (id in PLANS) {
        return PLANS[id as PlanType];
    }
    return undefined;
}

// ============================================
// Event Type Configuration
// ============================================

export interface EventTypeConfig {
    id: EventType;
    name: string;
    namePlural: string;
    icon: string;
    defaultSections: string[];
    optionalSections: string[];
}

export const EVENT_TYPES: Record<EventType, EventTypeConfig> = {
    wedding: {
        id: 'wedding',
        name: 'Casamento',
        namePlural: 'Casamentos',
        icon: '💒',
        defaultSections: ['hero', 'story', 'details', 'location', 'rsvp', 'gifts', 'gallery'],
        optionalSections: ['bridesmaids', 'dresscode', 'accommodation', 'schedule'],
    },
    graduation: {
        id: 'graduation',
        name: 'Formatura',
        namePlural: 'Formaturas',
        icon: '🎓',
        defaultSections: ['hero', 'ceremony', 'party', 'location', 'dresscode', 'rsvp', 'gallery'],
        optionalSections: ['after', 'links', 'message'],
    },
};

export function getEventTypeConfig(type: string): EventTypeConfig {
    if (type in EVENT_TYPES) {
        return EVENT_TYPES[type as EventType];
    }
    return EVENT_TYPES.wedding; // Default to wedding
}

// ============================================
// Feature Check Utilities
// ============================================

export function canExportCSV(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].canExportCSV;
}

export function hasWatermark(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].hasWatermark;
}

export function canSetPassword(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].canSetPassword;
}

export function hasPremiumTemplates(plan: PlanType): boolean {
    return PLAN_FEATURES[plan].hasPremiumTemplates;
}

