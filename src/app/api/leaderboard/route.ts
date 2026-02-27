import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Tournament } from '@/lib/types';
import { calculateStandings } from '@/lib/scoring';

interface LeaderboardEntry {
    rank: number;
    playerName: string;
    linkedUserId: string | null;
    totalPoints: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    pointDifference: number;
    winRate: number;
    tournamentsPlayed: number;
}

/**
 * GET /api/leaderboard?period=overall|monthly|weekly|daily&type=all|official
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'overall';
    const type = searchParams.get('type') || 'all';

    // Calculate date filter
    const now = new Date();
    let dateFrom: Date | null = null;

    switch (period) {
        case 'daily':
            dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        case 'weekly': {
            const day = now.getDay();
            const diff = day === 0 ? 6 : day - 1; // Monday = start
            dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
            break;
        }
        case 'monthly':
            dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'overall':
        default:
            dateFrom = null;
            break;
    }

    // Build query filter
    const where: Record<string, unknown> = { status: 'finished' };
    if (dateFrom) {
        where.updatedAt = { gte: dateFrom };
    }
    if (type === 'official') {
        where.isOfficial = true;
    }

    const dbTournaments = await prisma.tournament.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
    });

    // Aggregate stats per player across tournaments
    const playerStats = new Map<string, {
        playerName: string;
        linkedUserId: string | null;
        totalPoints: number;
        matchesPlayed: number;
        matchesWon: number;
        matchesLost: number;
        pointDifference: number;
        tournamentsPlayed: number;
    }>();

    for (const dbT of dbTournaments) {
        let tournament: Tournament;
        try {
            tournament = { ...JSON.parse(dbT.data), id: dbT.id } as Tournament;
        } catch {
            continue;
        }

        if (tournament.status !== 'finished') continue;

        const standings = calculateStandings(tournament);

        for (const s of standings) {
            const player = tournament.players.find(p => p.id === s.playerId);
            // Use playerName + linkedUserId as composite key for deduplication
            const key = player?.linkedUserId || `guest_${s.playerName}`;

            const existing = playerStats.get(key) || {
                playerName: s.playerName,
                linkedUserId: player?.linkedUserId || null,
                totalPoints: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                matchesLost: 0,
                pointDifference: 0,
                tournamentsPlayed: 0,
            };

            existing.totalPoints += s.totalPoints;
            existing.matchesPlayed += s.matchesPlayed;
            existing.matchesWon += s.matchesWon;
            existing.matchesLost += s.matchesLost;
            existing.pointDifference += s.pointDifference;
            existing.tournamentsPlayed += 1;
            // Prefer the most recent name
            existing.playerName = s.playerName;

            playerStats.set(key, existing);
        }
    }

    // Sort and rank
    const sorted = Array.from(playerStats.values())
        .sort((a, b) => {
            if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
            if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
            return b.pointDifference - a.pointDifference;
        });

    const leaderboard: LeaderboardEntry[] = sorted.map((entry, idx) => ({
        rank: idx + 1,
        playerName: entry.playerName,
        linkedUserId: entry.linkedUserId,
        totalPoints: entry.totalPoints,
        matchesPlayed: entry.matchesPlayed,
        matchesWon: entry.matchesWon,
        matchesLost: entry.matchesLost,
        pointDifference: entry.pointDifference,
        winRate: entry.matchesPlayed > 0
            ? Math.round((entry.matchesWon / entry.matchesPlayed) * 100)
            : 0,
        tournamentsPlayed: entry.tournamentsPlayed,
    }));

    return NextResponse.json({
        period,
        type,
        entries: leaderboard,
        totalTournaments: dbTournaments.length,
    });
}
