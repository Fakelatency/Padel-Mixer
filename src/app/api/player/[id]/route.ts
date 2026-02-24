import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Tournament } from '@/lib/types';
import { calculateStandings } from '@/lib/scoring';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Find the user
    const user = await prisma.user.findFirst({
        where: { id },
        select: { id: true, name: true, createdAt: true },
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all tournaments and find ones where user is linked as a player
    const allTournaments = await prisma.tournament.findMany({
        orderBy: { updatedAt: 'desc' },
    });

    const finishedTournaments: Tournament[] = [];
    for (const dbT of allTournaments) {
        const tournament = { ...JSON.parse(dbT.data), id: dbT.id } as Tournament;
        if (tournament.status !== 'finished') continue;

        const isLinked = tournament.players.some((p) => p.linkedUserId === id);
        const isOwner = dbT.userId === id;

        if (isLinked || isOwner) {
            finishedTournaments.push(tournament);
        }
    }

    let totalMatchesPlayed = 0;
    let totalMatchesWon = 0;
    let totalMatchesLost = 0;
    let totalPoints = 0;
    let totalPointDifference = 0;
    let tournamentsWon = 0;

    const recentTournaments: {
        tournamentId: string;
        tournamentName: string;
        format: string;
        placement: number;
        totalPlayers: number;
        points: number;
        matchesWon: number;
        matchesLost: number;
        pointDifference: number;
        finishedAt: string;
    }[] = [];

    const partnerMap = new Map<string, { name: string; matches: number; wins: number }>();

    for (const tournament of finishedTournaments) {
        const standings = calculateStandings(tournament);

        const userPlayer = tournament.players.find((p) => p.linkedUserId === id);
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

    const bestPartners = Array.from(partnerMap.values())
        .sort((a, b) => b.wins - a.wins || b.matches - a.matches)
        .slice(0, 5)
        .map((p) => ({
            partnerName: p.name,
            sharedMatches: p.matches,
            sharedWins: p.wins,
        }));

    return NextResponse.json({
        user: {
            id: user.id,
            name: user.name,
            createdAt: user.createdAt.toISOString(),
        },
        stats: {
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
        },
    });
}
