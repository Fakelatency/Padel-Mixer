import { auth } from './auth';
import { headers } from 'next/headers';
import { prisma } from './prisma';
import { NextResponse } from 'next/server';

/**
 * Get the current authenticated user from the request headers.
 */
export async function getAuthUser() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        return session?.user ?? null;
    } catch {
        return null;
    }
}

/**
 * Get the current user with role from the database.
 * Returns null if not authenticated.
 */
export async function getAuthUserWithRole() {
    const sessionUser = await getAuthUser();
    if (!sessionUser) return null;

    const dbUser = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        select: { id: true, name: true, email: true, role: true, image: true },
    });

    return dbUser;
}

/**
 * Guard: returns 401 if not authenticated, 403 if not admin.
 * Returns the user if authorized, or a NextResponse error.
 */
export async function requireAdmin(): Promise<
    | { user: { id: string; name: string; email: string; role: string }; error?: never }
    | { error: NextResponse; user?: never }
> {
    const user = await getAuthUserWithRole();

    if (!user) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
    }

    if (user.role !== 'admin') {
        return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
    }

    return { user };
}
