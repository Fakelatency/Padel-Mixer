import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';
import { Tournament } from '@/lib/types';
import { calculateStandings } from '@/lib/scoring';

async function getUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session?.user ?? null;
    } catch {
        return null;
    }
}

interface TournamentResult {
    tournamentId: string;
    tournamentName: string;
    format: string;
    placement: number;
    totalPlayers: number;
    points: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    pointDifference: number;
    finishedAt: string;
}

interface PartnerStat {
    partnerName: string;
    sharedMatches: number;
    sharedWins: number;
}

export interface UserStats {
    tournamentsPlayed: number;
    tournamentsWon: number;
    totalMatchesPlayed: number;
    totalMatchesWon: number;
    totalMatchesLost: number;
    totalPoints: number;
    totalPointDifference: number;
    winRate: number;
    avgPointsPerMatch: number;
    recentTournaments: TournamentResult[];
    bestPartners: PartnerStat[];
}

export async function GET() {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all tournaments owned by this user
    const dbTournaments = await prisma.tournament.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: 'desc' },
    });

    // Also get tournaments where user is linked as a player (not owner)
    const allTournaments = await prisma.tournament.findMany({
        orderBy: { updatedAt: 'desc' },
    });

    // Parse and find all tournaments where user participates
    const participatedTournaments: { tournament: Tournament; isOwner: boolean }[] = [];

    const ownedIds = new Set(dbTournaments.map((t) => t.id));

    for (const dbT of allTournaments) {
        const tournament = { ...JSON.parse(dbT.data), id: dbT.id } as Tournament;

        // Check if user is linked as a player
        const isLinked = tournament.players.some((p) => p.linkedUserId === user.id);
        const isOwner = ownedIds.has(dbT.id);

        if (isLinked || isOwner) {
            participatedTournaments.push({ tournament, isOwner });
        }
    }

    // Only count finished tournaments for stats
    const finishedTournaments = participatedTournaments.filter(
        ({ tournament }) => tournament.status === 'finished'
    );

    let totalMatchesPlayed = 0;
    let totalMatchesWon = 0;
    let totalMatchesLost = 0;
    let totalPoints = 0;
    let totalPointDifference = 0;
    let tournamentsWon = 0;
    const recentTournaments: TournamentResult[] = [];
    const partnerMap = new Map<string, { name: string; matches: number; wins: number }>();

    for (const { tournament } of finishedTournaments) {
        const standings = calculateStandings(tournament);

        // Find user's player in this tournament
        const userPlayer = tournament.players.find((p) => p.linkedUserId === user.id);
        if (!userPlayer) continue;

        const playerStats = standings.find((s) => s.playerId === userPlayer.id);
        if (!playerStats) continue;

        const placement = standings.indexOf(playerStats) + 1;
        if (placement === 1) tournamentsWon++;

        totalMatchesPlayed += playerStats.matchesPlayed;
        totalMatchesWon += playerStats.matchesWon;
        totalMatchesLost += playerStats.matchesLost;
        totalPoints += playerStats.totalPoints;
        totalPointDifference += playerStats.pointDifference;

        recentTournaments.push({
            tournamentId: tournament.id,
            tournamentName: tournament.name,
            format: tournament.format,
            placement,
            totalPlayers: tournament.players.length,
            points: playerStats.totalPoints,
            matchesPlayed: playerStats.matchesPlayed,
            matchesWon: playerStats.matchesWon,
            matchesLost: playerStats.matchesLost,
            pointDifference: playerStats.pointDifference,
            finishedAt: tournament.updatedAt,
        });

        // Track partners
        for (const round of tournament.rounds) {
            for (const match of round.matches) {
                if (match.status !== 'completed' || match.score1 === null || match.score2 === null) continue;

                const inTeam1 = match.team1.playerIds.includes(userPlayer.id);
                const inTeam2 = match.team2.playerIds.includes(userPlayer.id);

                if (inTeam1) {
                    const won = match.score1 > match.score2;
                    for (const pid of match.team1.playerIds) {
                        if (pid !== userPlayer.id) {
                            const pName = tournament.players.find((p) => p.id === pid)?.name || pid;
                            const existing = partnerMap.get(pName) || { name: pName, matches: 0, wins: 0 };
                            existing.matches++;
                            if (won) existing.wins++;
                            partnerMap.set(pName, existing);
                        }
                    }
                } else if (inTeam2) {
                    const won = match.score2 > match.score1;
                    for (const pid of match.team2.playerIds) {
                        if (pid !== userPlayer.id) {
                            const pName = tournament.players.find((p) => p.id === pid)?.name || pid;
                            const existing = partnerMap.get(pName) || { name: pName, matches: 0, wins: 0 };
                            existing.matches++;
                            if (won) existing.wins++;
                            partnerMap.set(pName, existing);
                        }
                    }
                }
            }
        }
    }

    const bestPartners: PartnerStat[] = Array.from(partnerMap.values())
        .sort((a, b) => b.wins - a.wins || b.matches - a.matches)
        .slice(0, 5)
        .map((p) => ({
            partnerName: p.name,
            sharedMatches: p.matches,
            sharedWins: p.wins,
        }));

    const stats: UserStats = {
        tournamentsPlayed: finishedTournaments.length,
        tournamentsWon,
        totalMatchesPlayed,
        totalMatchesWon,
        totalMatchesLost,
        totalPoints,
        totalPointDifference,
        winRate: totalMatchesPlayed > 0 ? Math.round((totalMatchesWon / totalMatchesPlayed) * 100) : 0,
        avgPointsPerMatch: totalMatchesPlayed > 0 ? Math.round((totalPoints / totalMatchesPlayed) * 10) / 10 : 0,
        recentTournaments: recentTournaments.slice(0, 10),
        bestPartners,
    };

    return NextResponse.json(stats);
}
