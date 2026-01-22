/**
 * LUMA Core Types
 * Essential types for the application
 */

// ============================================
// Gift Types
// ============================================

export interface GiftItem {
    id: string;
    name: string;
    price: number;
    image?: string;
    description?: string;
    category?: string;
}

// ============================================
// RSVP Types
// ============================================

export interface RSVPGuest {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    isAttending: boolean;
    guests: number;
    children: "sim" | "nao";
    message?: string;
    group?: string;
    createdAt: string;
}

export function generateRSVPId(): string {
    return `rsvp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Transaction Types
// ============================================

export interface GiftTransaction {
    id: string;
    giftId: string;
    giftName: string;
    amount: number;
    guestName: string;
    senderName?: string;
    guestEmail?: string;
    message?: string;
    paymentMethod: "pix" | "credit_card" | "bank_transfer";
    status: "pending" | "completed" | "failed";
    createdAt: string;
}

export function generateTransactionId(): string {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
