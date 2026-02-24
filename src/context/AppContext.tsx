'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { Locale, getTranslations, Translations } from '@/lib/i18n';
import { Tournament, TournamentSettings, Match, Player, Team, Round } from '@/lib/types';
import {
    saveTournament as apiSaveTournament,
    loadTournament as apiLoadTournament,
    listTournaments as apiListTournaments,
    deleteTournament as apiDeleteTournament,
    saveLocale,
    loadLocale,
} from '@/lib/storage';
import { calculateStandings, calculateTeamStandings } from '@/lib/scoring';
import {
    generateAmericanoRounds,
    generateMixedAmericanoRounds,
    generateTeamAmericanoRounds,
    generateMexicanoRound,
    generateTeamMexicanoRound,
    generateFinalAmericanoRound,
    generateAmericanoNextRound,
} from '@/lib/scheduler';
import { authClient } from '@/lib/auth-client';

// ─── State ──────────────────────────────────────────────────
interface AppState {
    locale: Locale;
    t: Translations;
    tournaments: Tournament[];
    currentTournament: Tournament | null;
    user: { id: string; name: string; email: string } | null;
    authLoading: boolean;
}

type Action =
    | { type: 'SET_LOCALE'; locale: Locale }
    | { type: 'LOAD_TOURNAMENTS'; tournaments: Tournament[] }
    | { type: 'SET_CURRENT_TOURNAMENT'; tournament: Tournament | null }
    | { type: 'SET_TOURNAMENT_CREATED'; tournament: Tournament }
    | { type: 'UPDATE_TOURNAMENT'; tournament: Tournament }
    | { type: 'DELETE_TOURNAMENT'; id: string }
    | { type: 'SET_USER'; user: AppState['user'] }
    | { type: 'SET_AUTH_LOADING'; loading: boolean };

function generateTournamentId(): string {
    return `t_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
}

function createTournamentData(settings: TournamentSettings): Tournament {
    const id = generateTournamentId();
    const now = new Date().toISOString();
    const roundMode = settings.roundMode || 'fixed';
    const rankingStrategy = settings.rankingStrategy || 'points';
    const totalRounds = settings.totalRounds || null;

    let rounds: Round[] = [];

    if (roundMode === 'unlimited' && ['americano', 'mixedAmericano', 'teamAmericano'].includes(settings.format)) {
        const firstRound = generateAmericanoNextRound(settings.players, [], settings.courts);
        rounds = [firstRound];
    } else {
        switch (settings.format) {
            case 'americano':
                rounds = generateAmericanoRounds(settings.players, settings.courts);
                break;
            case 'mixedAmericano':
                rounds = generateMixedAmericanoRounds(settings.players, settings.courts);
                break;
            case 'teamAmericano':
                rounds = generateTeamAmericanoRounds(settings.teams, settings.players, settings.courts);
                break;
            case 'mexicano': {
                const firstRound = generateMexicanoRound(settings.players, [], 1, settings.courts, rankingStrategy);
                rounds = [firstRound];
                break;
            }
            case 'teamMexicano': {
                const firstRound = generateTeamMexicanoRound(settings.teams, settings.players, [], 1, settings.courts);
                rounds = [firstRound];
                break;
            }
            default:
                rounds = generateAmericanoRounds(settings.players, settings.courts);
        }

        // Handle specific number of rounds for Fixed mode (only for Americano types that are pre-generated)
        if (roundMode === 'fixed' && totalRounds && ['americano', 'mixedAmericano', 'teamAmericano'].includes(settings.format)) {
            if (rounds.length > totalRounds) {
                // Slice if fewer rounds requested
                rounds = rounds.slice(0, totalRounds);
            } else if (rounds.length < totalRounds) {
                // Generate extra rounds if more requested
                while (rounds.length < totalRounds) {
                    const nextRound = generateAmericanoNextRound(settings.players, rounds, settings.courts);
                    rounds.push(nextRound);
                }
            }
        }
    }

    return {
        id,
        name: settings.name,
        format: settings.format,
        scoringSystem: settings.scoringSystem,
        players: settings.players,
        teams: settings.teams || [],
        courts: settings.courts,
        rounds,
        currentRound: 1,
        roundMode,
        totalRounds,
        rankingStrategy,
        status: 'active',
        createdAt: now,
        updatedAt: now,
    };
}

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'SET_LOCALE': {
            saveLocale(action.locale);
            return { ...state, locale: action.locale, t: getTranslations(action.locale) };
        }

        case 'LOAD_TOURNAMENTS': {
            return { ...state, tournaments: action.tournaments };
        }

        case 'SET_CURRENT_TOURNAMENT': {
            return { ...state, currentTournament: action.tournament };
        }

        case 'SET_TOURNAMENT_CREATED': {
            const tournaments = [...state.tournaments, action.tournament];
            return { ...state, tournaments, currentTournament: action.tournament };
        }

        case 'UPDATE_TOURNAMENT': {
            const tournament = action.tournament;
            const tournaments = state.tournaments.map((t) =>
                t.id === tournament.id ? tournament : t
            );
            return { ...state, currentTournament: tournament, tournaments };
        }

        case 'DELETE_TOURNAMENT': {
            const tournaments = state.tournaments.filter((t) => t.id !== action.id);
            const currentTournament =
                state.currentTournament?.id === action.id ? null : state.currentTournament;
            return { ...state, tournaments, currentTournament };
        }

        case 'SET_USER': {
            return { ...state, user: action.user };
        }

        case 'SET_AUTH_LOADING': {
            return { ...state, authLoading: action.loading };
        }

        default:
            return state;
    }
}

// ─── Context ────────────────────────────────────────────────
interface AppContextType extends AppState {
    dispatch: React.Dispatch<Action>;
    setLocale: (locale: Locale) => void;
    loadTournamentById: (id: string) => void;
    createTournament: (settings: TournamentSettings) => Promise<Tournament>;
    updateScore: (matchId: string, score1: number, score2: number) => void;
    nextRound: () => void;
    generateFinalRound: () => void;
    finishTournament: () => void;
    removeTournament: (id: string) => void;
    refreshTournaments: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const initialLocale: Locale = 'pl';
    const [state, dispatch] = useReducer(reducer, {
        locale: initialLocale,
        t: getTranslations(initialLocale),
        tournaments: [],
        currentTournament: null,
        user: null,
        authLoading: true,
    });

    // ─── Auth Session ───────────────────────────────────────
    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (!isPending) {
            dispatch({ type: 'SET_AUTH_LOADING', loading: false });
            if (session?.user) {
                dispatch({
                    type: 'SET_USER',
                    user: {
                        id: session.user.id,
                        name: session.user.name,
                        email: session.user.email,
                    },
                });
            } else {
                dispatch({ type: 'SET_USER', user: null });
            }
        }
    }, [session, isPending]);

    // ─── Load locale + tournaments on mount ─────────────────
    useEffect(() => {
        const savedLocale = loadLocale() as Locale;
        if (savedLocale && savedLocale !== initialLocale) {
            dispatch({ type: 'SET_LOCALE', locale: savedLocale });
        }
    }, []);

    // Load tournaments on mount and when user changes
    useEffect(() => {
        if (!state.authLoading) {
            apiListTournaments().then((tournaments) => {
                dispatch({ type: 'LOAD_TOURNAMENTS', tournaments });
            });
        }
    }, [state.user, state.authLoading]);

    const setLocale = useCallback((locale: Locale) => {
        dispatch({ type: 'SET_LOCALE', locale });
    }, []);

    const loadTournamentById = useCallback((id: string) => {
        apiLoadTournament(id).then((tournament) => {
            dispatch({ type: 'SET_CURRENT_TOURNAMENT', tournament });
        });
    }, []);

    const refreshTournaments = useCallback(() => {
        apiListTournaments().then((tournaments) => {
            dispatch({ type: 'LOAD_TOURNAMENTS', tournaments });
        });
    }, []);

    // ─── Tournament Actions (async) ─────────────────────────

    const createTournament = useCallback(async (settings: TournamentSettings): Promise<Tournament> => {
        // Auto-link logged-in user to matching player by name
        if (state.user) {
            const userName = state.user.name.toLowerCase().trim();
            settings = {
                ...settings,
                players: settings.players.map((p) => {
                    if (p.name.toLowerCase().trim() === userName) {
                        return { ...p, linkedUserId: state.user!.id };
                    }
                    return p;
                }),
            };
        }
        const tournament = createTournamentData(settings);
        await apiSaveTournament(tournament);
        dispatch({ type: 'SET_TOURNAMENT_CREATED', tournament });
        return tournament;
    }, [state.user]);

    const updateScore = useCallback((matchId: string, score1: number, score2: number) => {
        if (!state.currentTournament) return;
        const t = { ...state.currentTournament };
        t.rounds = t.rounds.map((round) => ({
            ...round,
            matches: round.matches.map((match) => {
                if (match.id === matchId) {
                    return {
                        ...match,
                        score1,
                        score2,
                        status: 'completed' as const,
                    };
                }
                return match;
            }),
        }));

        const currentRound = t.rounds[t.currentRound - 1];
        if (currentRound) {
            currentRound.completed = currentRound.matches.every(
                (m) => m.status === 'completed'
            );
        }

        t.updatedAt = new Date().toISOString();
        apiSaveTournament(t);
        dispatch({ type: 'UPDATE_TOURNAMENT', tournament: t });
    }, [state.currentTournament]);

    const nextRound = useCallback(() => {
        if (!state.currentTournament) return;
        const t = { ...state.currentTournament };
        const nextRoundNumber = t.currentRound + 1;

        if (t.format === 'mexicano') {
            const standings = calculateStandings(t);
            const newRound = generateMexicanoRound(t.players, standings, nextRoundNumber, t.courts, t.rankingStrategy);
            t.rounds = [...t.rounds, newRound];
        } else if (t.format === 'teamMexicano') {
            const teamStandings = calculateTeamStandings(t);
            const newRound = generateTeamMexicanoRound(
                t.teams,
                t.players,
                teamStandings,
                nextRoundNumber,
                t.courts
            );
            t.rounds = [...t.rounds, newRound];
        } else if (t.roundMode === 'unlimited') {
            const newRound = generateAmericanoNextRound(t.players, t.rounds, t.courts);
            t.rounds = [...t.rounds, newRound];
        }

        if (nextRoundNumber > t.rounds.length) {
            return;
        }

        t.currentRound = nextRoundNumber;
        t.updatedAt = new Date().toISOString();
        apiSaveTournament(t);
        dispatch({ type: 'UPDATE_TOURNAMENT', tournament: t });
    }, [state.currentTournament]);

    const generateFinalRound = useCallback(() => {
        if (!state.currentTournament) return;
        const t = { ...state.currentTournament };
        const standings = calculateStandings(t);
        const nextRoundNumber = t.currentRound + 1;
        const finalRound = generateFinalAmericanoRound(t.players, standings, t.courts, t.rankingStrategy);
        finalRound.number = nextRoundNumber;
        finalRound.matches = finalRound.matches.map((m) => ({ ...m, round: nextRoundNumber - 1 }));
        t.rounds = [...t.rounds, finalRound];
        t.currentRound = nextRoundNumber;
        t.updatedAt = new Date().toISOString();
        apiSaveTournament(t);
        dispatch({ type: 'UPDATE_TOURNAMENT', tournament: t });
    }, [state.currentTournament]);

    const finishTournament = useCallback(() => {
        if (!state.currentTournament) return;
        const t = { ...state.currentTournament, status: 'finished' as const, updatedAt: new Date().toISOString() };
        apiSaveTournament(t);
        dispatch({ type: 'UPDATE_TOURNAMENT', tournament: t });
    }, [state.currentTournament]);

    const removeTournament = useCallback((id: string) => {
        apiDeleteTournament(id);
        dispatch({ type: 'DELETE_TOURNAMENT', id });
    }, []);

    return (
        <AppContext.Provider value={{
            ...state,
            dispatch,
            setLocale,
            loadTournamentById,
            createTournament,
            updateScore,
            nextRound,
            generateFinalRound,
            finishTournament,
            removeTournament,
            refreshTournaments,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppContextType {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
