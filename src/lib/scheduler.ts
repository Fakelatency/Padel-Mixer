// ==========================================
// Match Scheduling & Pairing Algorithms
// ==========================================

import { Match, MatchTeam, Player, PlayerStats, Round, Team } from './types';

let matchIdCounter = 0;
let roundIdCounter = 0;

function generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ─── Americano (Classic) ────────────────────────────────────
// Round-robin rotation — every player pairs with and faces every other player.
// Uses "circle method": fix one player, rotate the rest.
export function generateAmericanoRounds(
    players: Player[],
    courts: number
): Round[] {
    const n = players.length;
    const ids = shuffle(players.map((p) => p.id));
    const rounds: Round[] = [];

    // Track how many times each pair has played together as partners
    const partnerCount = new Map<string, number>();
    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    // Circle method: fix first player, rotate the rest
    const fixed = ids[0];
    const rotating = ids.slice(1);
    const totalRounds = n - 1; // maximum unique rotations

    for (let r = 0; r < totalRounds; r++) {
        const currentOrder = [fixed, ...rotateArray(rotating, r)];
        const roundMatches: Match[] = [];
        const usedInRound = new Set<string>();

        for (let c = 0; c < courts; c++) {
            // Pick 4 players for this court from the rotated list

            const idx1 = c * 2;
            const idx2 = currentOrder.length - 1 - c * 2;
            const idx3 = c * 2 + 1;
            const idx4 = currentOrder.length - 2 - c * 2;

            if (idx3 >= idx4 || idx1 >= currentOrder.length || idx2 < 0 || idx3 >= currentOrder.length || idx4 < 0) break;

            const p1 = currentOrder[idx1];
            const p2 = currentOrder[idx2];
            const p3 = currentOrder[idx3];
            const p4 = currentOrder[idx4];

            // Check all are unique and not already used
            const four = [p1, p2, p3, p4];
            if (new Set(four).size !== 4) break;
            if (four.some((id) => usedInRound.has(id))) break;

            // Choose team split that minimizes repeat partnerships

            const options: [string[], string[]][] = [
                [[p1, p3], [p2, p4]],
                [[p1, p2], [p3, p4]],
                [[p1, p4], [p2, p3]],
            ];

            // Pick the option with the fewest repeated partnerships
            let bestOption = options[0];
            let bestScore = Infinity;
            for (const [t1, t2] of options) {
                const score = (partnerCount.get(pairKey(t1[0], t1[1])) || 0)
                    + (partnerCount.get(pairKey(t2[0], t2[1])) || 0);
                if (score < bestScore) {
                    bestScore = score;
                    bestOption = [t1, t2];
                }
            }

            const [team1, team2] = bestOption;

            // Track partnerships
            partnerCount.set(pairKey(team1[0], team1[1]), (partnerCount.get(pairKey(team1[0], team1[1])) || 0) + 1);
            partnerCount.set(pairKey(team2[0], team2[1]), (partnerCount.get(pairKey(team2[0], team2[1])) || 0) + 1);

            four.forEach((id) => usedInRound.add(id));

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: team1 },
                team2: { playerIds: team2 },
                score1: null,
                score2: null,
                status: 'upcoming',
            });
        }

        if (roundMatches.length === 0) continue;

        const sitting = ids.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: rounds.length + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Ranking Helper ─────────────────────────────────────────
export function sortStandings(
    standings: PlayerStats[],
    strategy: 'points' | 'wins'
): PlayerStats[] {
    return [...standings].sort((a, b) => {
        if (strategy === 'wins') {
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            return b.pointDifference - a.pointDifference;
        }
        // Default: points
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
        return b.matchesWon - a.matchesWon;
    });
}

// ─── Final Americano Round ───────────────────────────────────
// Creates a final round based on current standings.
// Pairing strategy is configurable: '1&2v3&4', '1&3v2&4', '1&4v2&3'
export function generateFinalAmericanoRound(
    players: Player[],
    standings: PlayerStats[],
    courts: number,
    rankingStrategy: 'points' | 'wins' = 'points',
    finalPairing: '1&2v3&4' | '1&3v2&4' | '1&4v2&3' = '1&4v2&3'
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    // Sort by standings based on strategy
    const orderedIds = sortStandings(standings, rankingStrategy)
        .map((s) => s.playerId);

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= orderedIds.length) break;

        // Apply the selected final pairing strategy
        let team1: string[];
        let team2: string[];
        switch (finalPairing) {
            case '1&2v3&4':
                team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 1]];
                team2 = [orderedIds[baseIdx + 2], orderedIds[baseIdx + 3]];
                break;
            case '1&3v2&4':
                team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 2]];
                team2 = [orderedIds[baseIdx + 1], orderedIds[baseIdx + 3]];
                break;
            case '1&4v2&3':
            default:
                team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 3]];
                team2 = [orderedIds[baseIdx + 1], orderedIds[baseIdx + 2]];
                break;
        }

        team1.forEach((id) => usedInRound.add(id));
        team2.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: 0, // will be set properly by caller
            court: c + 1,
            team1: { playerIds: team1 },
            team2: { playerIds: team2 },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: 0, // will be set by caller
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Final Team Americano Round ──────────────────────────────
export function generateFinalTeamAmericanoRound(
    teams: Team[],
    players: Player[],
    teamStandings: { teamId: string; totalPoints: number; pointDifference: number; matchesWon: number }[],
    courts: number,
    rankingStrategy: 'points' | 'wins' = 'points',
    finalPairing: '1&2v3&4' | '1&3v2&4' | '1&4v2&3' = '1&4v2&3'
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    const sortedStandings = [...teamStandings].sort((a, b) => {
        if (rankingStrategy === 'wins') {
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            return b.pointDifference - a.pointDifference;
        }
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
        return b.matchesWon - a.matchesWon;
    });

    const orderedTeams = sortedStandings
        .map((s) => teams.find(t => t.id === s.teamId))
        .filter((t): t is Team => t !== undefined);

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= orderedTeams.length) break;

        let team1: Team;
        let team2: Team;
        switch (finalPairing) {
            case '1&2v3&4':

                team1 = orderedTeams[c * 2];
                team2 = orderedTeams[c * 2 + 1];
                break;
            case '1&3v2&4':
                team1 = orderedTeams[c * 2];
                team2 = orderedTeams[c * 2 + 1];
                break;
            case '1&4v2&3':
            default:
                team1 = orderedTeams[c * 2];
                team2 = orderedTeams[c * 2 + 1];
                break;
        }

        team1.playerIds.forEach((id) => usedInRound.add(id));
        team2.playerIds.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: 0,
            court: c + 1,
            team1: { playerIds: team1.playerIds },
            team2: { playerIds: team2.playerIds },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: 0,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Mixed Americano ────────────────────────────────────────
// Every team must have 1 male + 1 female
export function generateMixedAmericanoRounds(
    players: Player[],
    courts: number
): Round[] {
    const males = players.filter((p) => p.gender === 'male');
    const females = players.filter((p) => p.gender === 'female');
    const n = Math.min(males.length, females.length);
    const totalRounds = n - 1;
    const rounds: Round[] = [];

    const shuffledMales = shuffle(males.map((m) => m.id));
    const shuffledFemales = shuffle(females.map((f) => f.id));

    for (let r = 0; r < totalRounds; r++) {
        const roundMatches: Match[] = [];
        const usedInRound = new Set<string>();

        // Rotate females relative to males
        const rotatedFemales = [
            ...shuffledFemales.slice(r % n),
            ...shuffledFemales.slice(0, r % n),
        ];

        for (let c = 0; c < courts; c++) {
            const idx1 = c * 2;
            const idx2 = c * 2 + 1;

            if (idx2 >= n) break;

            const team1 = [shuffledMales[idx1], rotatedFemales[idx1]];
            const team2 = [shuffledMales[idx2], rotatedFemales[idx2]];

            team1.forEach((id) => usedInRound.add(id));
            team2.forEach((id) => usedInRound.add(id));

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: team1 },
                team2: { playerIds: team2 },
                score1: null,
                score2: null,
                status: 'upcoming',
            });
        }

        const allIds = players.map((p) => p.id);
        const sitting = allIds.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: r + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Team Americano ─────────────────────────────────────────
// Fixed teams, round-robin opponents
export function generateTeamAmericanoRounds(
    teams: Team[],
    players: Player[],
    courts: number
): Round[] {
    const n = teams.length;
    const rounds: Round[] = [];
    const totalRounds = n - 1;

    // Circle method for round-robin
    const teamIds = teams.map((t) => t.id);
    const fixed = teamIds[0];
    const rotating = teamIds.slice(1);

    for (let r = 0; r < totalRounds; r++) {
        const roundMatches: Match[] = [];
        const currentOrder = [fixed, ...rotateArray(rotating, r)];
        const usedInRound = new Set<string>();

        for (let c = 0; c < courts; c++) {
            const idx1 = c;
            const idx2 = currentOrder.length - 1 - c;
            if (idx1 >= idx2) break;

            const team1 = teams.find((t) => t.id === currentOrder[idx1])!;
            const team2 = teams.find((t) => t.id === currentOrder[idx2])!;

            team1.playerIds.forEach((id) => usedInRound.add(id));
            team2.playerIds.forEach((id) => usedInRound.add(id));

            roundMatches.push({
                id: generateId('match'),
                round: r,
                court: c + 1,
                team1: { playerIds: team1.playerIds },
                team2: { playerIds: team2.playerIds },
                score1: null,
                score2: null,
                status: 'upcoming',
            });
        }

        const allIds = players.map((p) => p.id);
        const sitting = allIds.filter((id) => !usedInRound.has(id));

        rounds.push({
            id: generateId('round'),
            number: r + 1,
            matches: roundMatches,
            completed: false,
            sitting,
        });
    }

    return rounds;
}

// ─── Mexicano ───────────────────────────────────────────────
// Dynamic pairing based on current standings.
// Round 1 is random, subsequent rounds pair by ranking:
// 1st+3rd vs 2nd+4th, 5th+7th vs 6th+8th, etc.
export function generateMexicanoRound(
    players: Player[],
    standings: PlayerStats[],
    roundNumber: number,
    courts: number,
    rankingStrategy: 'points' | 'wins' = 'points',
    existingRounds: Round[] = []
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    const sitOutCount = new Map<string, number>();
    for (const p of players) sitOutCount.set(p.id, 0);

    for (const r of existingRounds) {
        if (!r.sitting) continue;
        for (const sittingId of r.sitting) {
            sitOutCount.set(sittingId, (sitOutCount.get(sittingId) || 0) + 1);
        }
    }

    const playersNeeded = courts * 4;
    let activeIds: string[] = [];

    if (players.length <= playersNeeded) {
        activeIds = players.map(p => p.id);
    } else {
        const shuffled = shuffle([...players]);
        shuffled.sort((a, b) => {
            const countA = sitOutCount.get(a.id) || 0;
            const countB = sitOutCount.get(b.id) || 0;
            return countA - countB;
        });
        const numSitOut = players.length - playersNeeded;
        activeIds = shuffled.slice(numSitOut).map(p => p.id);
    }

    let orderedIds: string[];

    if (roundNumber === 1) {
        // Random for first round
        orderedIds = shuffle(activeIds);
    } else {
        // Sort active players by standings
        const activeStandings = standings.filter(s => activeIds.includes(s.playerId));
        orderedIds = sortStandings(activeStandings, rankingStrategy).map((s) => s.playerId);
    }

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= orderedIds.length) break;

        // 1st+3rd vs 2nd+4th pattern
        const team1 = [orderedIds[baseIdx], orderedIds[baseIdx + 2]];
        const team2 = [orderedIds[baseIdx + 1], orderedIds[baseIdx + 3]];

        team1.forEach((id) => usedInRound.add(id));
        team2.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1 },
            team2: { playerIds: team2 },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Team Mexicano ──────────────────────────────────────────
// Fixed teams, matches based on team standings
export function generateTeamMexicanoRound(
    teams: Team[],
    players: Player[],
    teamStandings: { teamId: string; totalPoints: number; pointDifference: number; matchesWon: number }[],
    roundNumber: number,
    courts: number,
    rankingStrategy: 'points' | 'wins' = 'points',
    existingRounds: Round[] = []
): Round {
    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    const sitOutCount = new Map<string, number>();
    for (const t of teams) sitOutCount.set(t.id, 0);

    for (const r of existingRounds) {
        if (!r.sitting) continue;
        for (const sittingId of r.sitting) {
            const team = teams.find(t => t.playerIds.includes(sittingId));
            if (team) {
                sitOutCount.set(team.id, (sitOutCount.get(team.id) || 0) + 1);
            }
        }
    }

    const teamsNeeded = courts * 2;
    let activeTeams: Team[] = [];

    if (teams.length <= teamsNeeded) {
        activeTeams = [...teams];
    } else {
        const shuffled = shuffle([...teams]);
        shuffled.sort((a, b) => {
            const countA = sitOutCount.get(a.id) || 0;
            const countB = sitOutCount.get(b.id) || 0;
            return countA - countB;
        });
        const numSitOut = teams.length - teamsNeeded;
        activeTeams = shuffled.slice(numSitOut);
    }

    let orderedTeams: Team[];

    if (roundNumber === 1) {
        orderedTeams = shuffle([...activeTeams]);
    } else {
        const activeStandings = teamStandings.filter(s => activeTeams.some(t => t.id === s.teamId));
        const sorted = [...activeStandings].sort((a, b) => {
            if (rankingStrategy === 'wins') {
                if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
                if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
                return b.pointDifference - a.pointDifference;
            }
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            if (b.pointDifference !== a.pointDifference) return b.pointDifference - a.pointDifference;
            return b.matchesWon - a.matchesWon;
        });
        orderedTeams = sorted.map(
            (s) => teams.find((t) => t.id === s.teamId)!
        );
    }

    for (let c = 0; c < courts; c++) {
        const idx1 = c * 2;
        const idx2 = c * 2 + 1;
        if (idx2 >= orderedTeams.length) break;

        const team1 = orderedTeams[idx1];
        const team2 = orderedTeams[idx2];

        team1.playerIds.forEach((id) => usedInRound.add(id));
        team2.playerIds.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1.playerIds },
            team2: { playerIds: team2.playerIds },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allIds = players.map((p) => p.id);
    const sitting = allIds.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Americano Dynamic Next Round (Unlimited Mode) ──────────
// Generates the next round dynamically for Americano in unlimited mode,
// analyzing past rounds to minimize repeat partnerships and sit-outs.
export function generateAmericanoNextRound(
    players: Player[],
    existingRounds: Round[],
    courts: number
): Round {
    const n = players.length;
    const ids = players.map((p) => p.id);
    const playersPerRound = courts * 4;
    const roundNumber = existingRounds.length + 1;

    // Track how many times each pair has been partners
    const partnerCount = new Map<string, number>();
    // Track how many times each pair has been opponents
    const opponentCount = new Map<string, number>();
    // Track how many times each player has sat out
    const sitOutCount = new Map<string, number>();

    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    for (const id of ids) {
        sitOutCount.set(id, 0);
    }

    for (const round of existingRounds) {
        for (const match of round.matches) {
            // Track partnerships
            for (let i = 0; i < match.team1.playerIds.length; i++) {
                for (let j = i + 1; j < match.team1.playerIds.length; j++) {
                    const key = pairKey(match.team1.playerIds[i], match.team1.playerIds[j]);
                    partnerCount.set(key, (partnerCount.get(key) || 0) + 1);
                }
            }
            for (let i = 0; i < match.team2.playerIds.length; i++) {
                for (let j = i + 1; j < match.team2.playerIds.length; j++) {
                    const key = pairKey(match.team2.playerIds[i], match.team2.playerIds[j]);
                    partnerCount.set(key, (partnerCount.get(key) || 0) + 1);
                }
            }
            // Track opponents
            for (const p1 of match.team1.playerIds) {
                for (const p2 of match.team2.playerIds) {
                    const key = pairKey(p1, p2);
                    opponentCount.set(key, (opponentCount.get(key) || 0) + 1);
                }
            }
        }
        for (const sittingId of round.sitting) {
            sitOutCount.set(sittingId, (sitOutCount.get(sittingId) || 0) + 1);
        }
    }

    // Determine who sits out: the players who have sat out the least should play
    // Sort by sit-out count descending (those who sat most should play)
    const sortedBySitOut = [...ids].sort(
        (a, b) => (sitOutCount.get(b) || 0) - (sitOutCount.get(a) || 0)
    );

    // Select players to play: pick the top `playersPerRound` (or all if enough)
    const activePlayers = sortedBySitOut.slice(0, Math.min(playersPerRound, n));
    const sitting = ids.filter((id) => !activePlayers.includes(id));

    // Shuffle active players for variety, then assign to courts
    const shuffled = shuffle(activePlayers);

    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();

    for (let c = 0; c < courts; c++) {
        const baseIdx = c * 4;
        if (baseIdx + 3 >= shuffled.length) break;

        const four = [shuffled[baseIdx], shuffled[baseIdx + 1], shuffled[baseIdx + 2], shuffled[baseIdx + 3]];

        // Choose the team split that minimizes repeat partnerships
        const options: [string[], string[]][] = [
            [[four[0], four[1]], [four[2], four[3]]],
            [[four[0], four[2]], [four[1], four[3]]],
            [[four[0], four[3]], [four[1], four[2]]],
        ];

        let bestOption = options[0];
        let bestScore = Infinity;
        for (const [t1, t2] of options) {
            const partnerPenalty =
                (partnerCount.get(pairKey(t1[0], t1[1])) || 0) +
                (partnerCount.get(pairKey(t2[0], t2[1])) || 0);
            const opponentPenalty =
                (opponentCount.get(pairKey(t1[0], t2[0])) || 0) +
                (opponentCount.get(pairKey(t1[0], t2[1])) || 0) +
                (opponentCount.get(pairKey(t1[1], t2[0])) || 0) +
                (opponentCount.get(pairKey(t1[1], t2[1])) || 0);
            const score = partnerPenalty * 3 + opponentPenalty;
            if (score < bestScore) {
                bestScore = score;
                bestOption = [t1, t2];
            }
        }

        const [team1, team2] = bestOption;
        four.forEach((id) => usedInRound.add(id));

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1 },
            team2: { playerIds: team2 },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    // Add any remaining active players not assigned to a court to sitting
    const finalSitting = ids.filter((id) => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting: finalSitting,
    };
}

// ─── Team Americano Dynamic Next Round (Unlimited Mode) ─────
// Generates the next round dynamically for Team Americano,
// analyzing past rounds to minimize repeat match-ups and sit-outs.
export function generateTeamAmericanoNextRound(
    teams: Team[],
    players: Player[],
    existingRounds: Round[],
    courts: number
): Round {
    const n = teams.length;
    const teamIds = teams.map((t) => t.id);
    const teamsPerRound = courts * 2;
    const roundNumber = existingRounds.length + 1;

    const matchupCount = new Map<string, number>();
    const sitOutCount = new Map<string, number>();

    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    for (const tid of teamIds) {
        sitOutCount.set(tid, 0);
    }

    for (const round of existingRounds) {
        for (const match of round.matches) {
            const team1 = teams.find(t => t.playerIds.every(pid => match.team1.playerIds.includes(pid)) && t.playerIds.length === match.team1.playerIds.length);
            const team2 = teams.find(t => t.playerIds.every(pid => match.team2.playerIds.includes(pid)) && t.playerIds.length === match.team2.playerIds.length);

            if (team1 && team2) {
                const key = pairKey(team1.id, team2.id);
                matchupCount.set(key, (matchupCount.get(key) || 0) + 1);
            }
        }
        for (const team of teams) {
            if (team.playerIds.every(pid => round.sitting.includes(pid))) {
                sitOutCount.set(team.id, (sitOutCount.get(team.id) || 0) + 1);
            }
        }
    }

    const sortedBySitOut = [...teamIds].sort(
        (a, b) => (sitOutCount.get(b) || 0) - (sitOutCount.get(a) || 0)
    );

    const activeTeamIds = sortedBySitOut.slice(0, Math.min(teamsPerRound, n));
    const shuffledActive = shuffle(activeTeamIds);

    const roundMatches: Match[] = [];
    const usedTeams = new Set<string>();

    for (let c = 0; c < courts; c++) {
        const available = shuffledActive.filter(tid => !usedTeams.has(tid));
        if (available.length < 2) break;

        const teamId1 = available[0];
        let bestTeamId2 = available[1];
        let minMatchups = Infinity;

        for (let i = 1; i < available.length; i++) {
            const mCount = matchupCount.get(pairKey(teamId1, available[i])) || 0;
            if (mCount < minMatchups) {
                minMatchups = mCount;
                bestTeamId2 = available[i];
            }
        }

        const team1 = teams.find(t => t.id === teamId1)!;
        const team2 = teams.find(t => t.id === bestTeamId2)!;

        usedTeams.add(teamId1);
        usedTeams.add(bestTeamId2);

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: team1.playerIds },
            team2: { playerIds: team2.playerIds },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const allPlayerIds = players.map(p => p.id);
    const usedPlayerIds = new Set<string>();
    roundMatches.forEach(m => {
        m.team1.playerIds.forEach(id => usedPlayerIds.add(id));
        m.team2.playerIds.forEach(id => usedPlayerIds.add(id));
    });

    const sitting = allPlayerIds.filter(id => !usedPlayerIds.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Mixed Americano Next Round (Unlimited/Rotating) ────────
export function generateMixedAmericanoNextRound(
    players: Player[],
    existingRounds: Round[],
    courts: number
): Round {
    const males = players.filter(p => p.gender === 'male');
    const females = players.filter(p => p.gender === 'female');
    const roundNumber = existingRounds.length + 1;

    const partnerCount = new Map<string, number>();
    const opponentCount = new Map<string, number>();
    const sitOutCount = new Map<string, number>();

    const pairKey = (a: string, b: string) => [a, b].sort().join('|');

    players.forEach(p => sitOutCount.set(p.id, 0));

    for (const round of existingRounds) {
        for (const match of round.matches) {
            [match.team1.playerIds, match.team2.playerIds].forEach(pids => {
                if (pids.length === 2) {
                    const key = pairKey(pids[0], pids[1]);
                    partnerCount.set(key, (partnerCount.get(key) || 0) + 1);
                }
            });
            match.team1.playerIds.forEach(p1 => {
                match.team2.playerIds.forEach(p2 => {
                    const key = pairKey(p1, p2);
                    opponentCount.set(key, (opponentCount.get(key) || 0) + 1);
                });
            });
        }
        round.sitting.forEach(id => sitOutCount.set(id, (sitOutCount.get(id) || 0) + 1));
    }

    const maleIds = males.map(m => m.id).sort((a, b) => (sitOutCount.get(b) || 0) - (sitOutCount.get(a) || 0));
    const femaleIds = females.map(f => f.id).sort((a, b) => (sitOutCount.get(b) || 0) - (sitOutCount.get(a) || 0));

    const numTeams = courts * 2;
    const activeMaleIds = maleIds.slice(0, numTeams);
    const activeFemaleIds = femaleIds.slice(0, numTeams);

    const shuffledMales = shuffle(activeMaleIds);
    let availableFemales = [...activeFemaleIds];
    const pairs: [string, string][] = [];

    for (const mId of shuffledMales) {
        let bestFId = availableFemales[0];
        let minPartnerships = Infinity;
        for (const fId of availableFemales) {
            const count = partnerCount.get(pairKey(mId, fId)) || 0;
            if (count < minPartnerships) {
                minPartnerships = count;
                bestFId = fId;
            }
        }
        pairs.push([mId, bestFId]);
        availableFemales = availableFemales.filter(id => id !== bestFId);
    }

    const roundMatches: Match[] = [];
    const shuffledPairsIdx = shuffle(pairs.map((_, i) => i));

    for (let c = 0; c < courts; c++) {
        const idx1 = shuffledPairsIdx[c * 2];
        const idx2 = shuffledPairsIdx[c * 2 + 1];
        if (idx2 === undefined) break;

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: pairs[idx1] },
            team2: { playerIds: pairs[idx2] },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    const usedInRound = new Set<string>();
    roundMatches.forEach(m => {
        m.team1.playerIds.forEach(id => usedInRound.add(id));
        m.team2.playerIds.forEach(id => usedInRound.add(id));
    });

    const sitting = players.map(p => p.id).filter(id => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Mixed Mexicano ─────────────────────────────────────────
export function generateMixedMexicanoRound(
    players: Player[],
    teams: Team[],
    standings: PlayerStats[],
    teamStandings: { teamId: string; totalPoints: number; pointDifference: number; matchesWon: number }[],
    roundNumber: number,
    courts: number,
    teamMode: 'fixed' | 'rotating',
    rankingStrategy: 'points' | 'wins' = 'points',
    existingRounds: Round[] = []
): Round {
    if (teamMode === 'fixed') {
        return generateTeamMexicanoRound(teams, players, teamStandings, roundNumber, courts, rankingStrategy, existingRounds);
    }

    const roundMatches: Match[] = [];
    const usedInRound = new Set<string>();
    
    const sitOutCount = new Map<string, number>();
    players.forEach(p => sitOutCount.set(p.id, 0));
    existingRounds.forEach(r => r.sitting.forEach(id => sitOutCount.set(id, (sitOutCount.get(id) || 0) + 1)));

    const males = players.filter(p => p.gender === 'male');
    const females = players.filter(p => p.gender === 'female');
    const numTeams = courts * 2;
    
    const activeMales = males.sort((a, b) => (sitOutCount.get(b.id) || 0) - (sitOutCount.get(a.id) || 0)).slice(0, numTeams);
    const activeFemales = females.sort((a, b) => (sitOutCount.get(b.id) || 0) - (sitOutCount.get(a.id) || 0)).slice(0, numTeams);

    const activeMalesStats = activeMales.map(m => standings.find(s => s.playerId === m.id)!).filter(Boolean);
    const orderedMales = sortStandings(activeMalesStats, rankingStrategy).map(s => s.playerId);

    const activeFemalesStats = activeFemales.map(f => standings.find(s => s.playerId === f.id)!).filter(Boolean);
    const orderedFemales = sortStandings(activeFemalesStats, rankingStrategy).map(s => s.playerId);

    const pairs: [string, string][] = orderedMales.map((mId, i) => [mId, orderedFemales[i] || ''] as [string, string]).filter(p => p[1] !== '');

    for (let c = 0; c < courts; c++) {
        const p1 = pairs[c * 2];
        const p2 = pairs[c * 2 + 1];
        if (!p2) break;

        roundMatches.push({
            id: generateId('match'),
            round: roundNumber - 1,
            court: c + 1,
            team1: { playerIds: p1 },
            team2: { playerIds: p2 },
            score1: null,
            score2: null,
            status: 'upcoming',
        });
    }

    roundMatches.forEach(m => {
        m.team1.playerIds.forEach(id => usedInRound.add(id));
        m.team2.playerIds.forEach(id => usedInRound.add(id));
    });

    const sitting = players.map(p => p.id).filter(id => !usedInRound.has(id));

    return {
        id: generateId('round'),
        number: roundNumber,
        matches: roundMatches,
        completed: false,
        sitting,
    };
}

// ─── Helpers ────────────────────────────────────────────────

function rotateArray<T>(arr: T[], count: number): T[] {
    const n = arr.length;
    const shift = count % n;
    return [...arr.slice(shift), ...arr.slice(0, shift)];
}
