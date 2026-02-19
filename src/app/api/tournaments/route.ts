import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

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

export async function GET() {
    const user = await getUser();

    // If logged in, show user's tournaments; otherwise show all anonymous tournaments
    const tournaments = await prisma.tournament.findMany({
        where: user ? { userId: user.id } : { userId: null },
        orderBy: { updatedAt: 'desc' },
        select: {
            id: true,
            name: true,
            status: true,
            data: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const parsed = tournaments.map((t) => ({
        ...JSON.parse(t.data),
        id: t.id,
    }));

    return NextResponse.json(parsed);
}

export async function POST(req: NextRequest) {
    const user = await getUser();
    const body = await req.json();
    const tournamentData = body as Record<string, unknown>;

    const tournament = await prisma.tournament.create({
        data: {
            id: tournamentData.id as string,
            userId: user?.id ?? null,
            name: (tournamentData.name as string) || 'Unnamed',
            status: (tournamentData.status as string) || 'active',
            data: JSON.stringify(tournamentData),
        },
    });

    return NextResponse.json({ ...JSON.parse(tournament.data), id: tournament.id }, { status: 201 });
}
