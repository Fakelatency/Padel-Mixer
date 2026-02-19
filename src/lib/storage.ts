// ==========================================
// API-Based Persistence (replaces localStorage)
// ==========================================

import { Tournament } from './types';

const API_BASE = '/api/tournaments';

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        credentials: 'include', // send session cookie
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }
    return res.json();
}

export async function saveTournament(tournament: Tournament): Promise<void> {
    try {
        // Try PUT first (update)
        await apiFetch(`${API_BASE}/${tournament.id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...tournament, updatedAt: new Date().toISOString() }),
        });
    } catch {
        // If not found, create
        await apiFetch(API_BASE, {
            method: 'POST',
            body: JSON.stringify(tournament),
        });
    }
}

export async function loadTournament(id: string): Promise<Tournament | null> {
    try {
        return await apiFetch<Tournament>(`${API_BASE}/${id}`);
    } catch {
        return null;
    }
}

export async function listTournaments(): Promise<Tournament[]> {
    try {
        return await apiFetch<Tournament[]>(API_BASE);
    } catch {
        return [];
    }
}

export async function deleteTournament(id: string): Promise<void> {
    try {
        await apiFetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    } catch {
        // ignore
    }
}

// Locale stays in localStorage — no server roundtrip needed
const LOCALE_KEY = 'padel_locale';

export function saveLocale(locale: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCALE_KEY, locale);
}

export function loadLocale(): string {
    if (typeof window === 'undefined') return 'pl';
    return localStorage.getItem(LOCALE_KEY) || 'pl';
}
