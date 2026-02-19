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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const tournament = await prisma.tournament.findFirst({
        where: { id },
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
    const body = await req.json();
    const tournamentData = body as Record<string, unknown>;

    const existing = await prisma.tournament.findFirst({
        where: { id },
    });

    if (!existing) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // If tournament has an owner, verify ownership
    if (existing.userId) {
        const user = await getUser();
        if (!user || user.id !== existing.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
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

    const existing = await prisma.tournament.findFirst({
        where: { id },
    });

    if (!existing) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // If tournament has an owner, verify ownership
    if (existing.userId) {
        const user = await getUser();
        if (!user || user.id !== existing.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    await prisma.tournament.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
