import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

async function getUser(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user ?? null;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tournament = await prisma.tournament.findFirst({
        where: { id, userId: user.id },
    });

    if (!tournament) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ...JSON.parse(tournament.data), id: tournament.id });
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const tournamentData = body as Record<string, unknown>;

    // Verify ownership
    const existing = await prisma.tournament.findFirst({
        where: { id, userId: user.id },
    });

    if (!existing) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updated = await prisma.tournament.update({
        where: { id },
        data: {
            name: (tournamentData.name as string) || existing.name,
            status: (tournamentData.status as string) || existing.status,
            data: JSON.stringify(tournamentData),
        },
    });

    return NextResponse.json({ ...JSON.parse(updated.data), id: updated.id });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const existing = await prisma.tournament.findFirst({
        where: { id, userId: user.id },
    });

    if (!existing) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
