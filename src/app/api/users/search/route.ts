import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q')?.trim();
    if (!q || q.length < 1) {
        return NextResponse.json({ users: [] });
    }

    const users = await prisma.user.findMany({
        where: {
            name: { contains: q },
        },
        select: { id: true, name: true },
        take: 10,
    });

    return NextResponse.json({ users });
}
