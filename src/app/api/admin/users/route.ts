import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

/**
 * GET /api/admin/users — List all users (admin only)
 */
export async function GET() {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            image: true,
            createdAt: true,
            _count: { select: { tournaments: true } },
        },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
}

/**
 * PATCH /api/admin/users — Update a user's role (admin only)
 * Body: { userId: string, role: "user" | "admin" }
 */
export async function PATCH(req: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Invalid userId or role' }, { status: 400 });
    }

    // Prevent self-demotion
    if (userId === user.id && role !== 'admin') {
        return NextResponse.json({ error: 'Cannot remove your own admin role' }, { status: 400 });
    }

    const updated = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
}

/**
 * DELETE /api/admin/users — Delete a user (admin only)
 * Body: { userId: string }
 */
export async function DELETE(req: NextRequest) {
    const { user, error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
        return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    if (userId === user.id) {
        return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
}
