/**
 * Medusa JS Client — connects the Next.js frontend to the Medusa backend.
 * The Medusa backend runs on port 9000 and handles:
 *   - Official/paid tournament management
 *   - Payment processing (Stripe)
 *   - Admin UI
 */

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:9000';

interface MedusaRequestOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
}

async function medusaFetch<T>(path: string, options: MedusaRequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || `Medusa API error: ${res.status}`);
    }

    return res.json();
}

// ─── Official Tournaments ────────────────────────────────

export interface OfficialTournament {
    id: string;
    name: string;
    description: string;
    date: string;
    maxPlayers: number;
    currentPlayers: number;
    entryFee: number;
    currency: string;
    status: 'upcoming' | 'registration_open' | 'registration_closed' | 'in_progress' | 'finished';
    format: string;
    location?: string;
}

export async function fetchOfficialTournaments(): Promise<OfficialTournament[]> {
    try {
        const data = await medusaFetch<{ tournaments: OfficialTournament[] }>('/store/tournaments');
        return data.tournaments || [];
    } catch {
        return [];
    }
}

export async function fetchOfficialTournament(id: string): Promise<OfficialTournament | null> {
    try {
        const data = await medusaFetch<{ tournament: OfficialTournament }>(`/store/tournaments/${id}`);
        return data.tournament || null;
    } catch {
        return null;
    }
}

// ─── Registration ────────────────────────────────────────

export interface RegistrationPayload {
    tournamentId: string;
    playerName: string;
    email: string;
    userId?: string;
}

export async function registerForTournament(payload: RegistrationPayload): Promise<{ success: boolean; registrationId?: string }> {
    return medusaFetch('/store/tournaments/register', {
        method: 'POST',
        body: payload,
    });
}

// ─── Payment ─────────────────────────────────────────────

export interface PaymentSession {
    id: string;
    clientSecret: string;
    amount: number;
    currency: string;
}

export async function createPaymentSession(tournamentId: string, registrationId: string): Promise<PaymentSession> {
    return medusaFetch('/store/tournaments/payment', {
        method: 'POST',
        body: { tournamentId, registrationId },
    });
}

// ─── Health Check ────────────────────────────────────────

export async function checkMedusaHealth(): Promise<boolean> {
    try {
        await medusaFetch('/health');
        return true;
    } catch {
        return false;
    }
}
