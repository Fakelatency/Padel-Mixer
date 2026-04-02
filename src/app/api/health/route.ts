import { NextResponse } from 'next/server';

export async function GET() {
    const checks: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        env: {
            DATABASE_URL: process.env.DATABASE_URL
                ? process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')
                : 'NOT SET',
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || 'NOT SET',
            NODE_ENV: process.env.NODE_ENV,
        },
    };

    // Try to connect to the database
    try {
        const { getPrisma } = await import('@/lib/prisma');
        const prisma = getPrisma();
        await prisma.$queryRawUnsafe('SELECT 1 as ok');
        checks.database = 'CONNECTED';
    } catch (error) {
        checks.database = 'FAILED';
        checks.databaseError = error instanceof Error
            ? { message: error.message, stack: error.stack }
            : String(error);
    }

    const status = checks.database === 'CONNECTED' ? 200 : 500;
    return NextResponse.json(checks, { status });
}
