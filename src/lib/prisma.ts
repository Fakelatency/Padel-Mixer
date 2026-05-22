import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (typeof connectionString !== 'string' || connectionString.trim() === '') {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    console.log('[Prisma] Connecting to database...',
        connectionString.replace(/\/\/.*@/, '//***:***@'));
    const adapter = new PrismaPg({
        connectionString,
        ssl: connectionString.includes('sslmode=disable')
            ? false
            : { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });
    return new PrismaClient({ adapter });
}

// Lazy initialization — only connect when first accessed
export function getPrisma(): PrismaClient {
    if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
    }
    return globalForPrisma.prisma;
}

// Keep backward-compatible export as a getter
export const prisma = new Proxy({} as PrismaClient, {
    get(_target, prop) {
        return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
    },
});
