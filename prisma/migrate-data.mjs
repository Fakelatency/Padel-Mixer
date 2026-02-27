/**
 * SQLite → PostgreSQL data migration script
 * Exports all data from the SQLite database and imports it to PostgreSQL.
 * Run AFTER `npx prisma migrate dev` has been applied to the PostgreSQL database.
 *
 * Usage: node prisma/migrate-data.mjs
 */
import Database from 'better-sqlite3';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SQLITE_PATH = join(__dirname, '..', 'dev.db');
const PG_URL = process.env.DATABASE_URL || 'postgresql://postgres:dwieliczby12@localhost:5432/padel_mixer';

async function migrate() {
    console.log('📦 Opening SQLite database...');
    const sqlite = new Database(SQLITE_PATH);

    console.log('🐘 Connecting to PostgreSQL...');
    const pgClient = new pg.Client({ connectionString: PG_URL });
    await pgClient.connect();

    // Migrate users
    const users = sqlite.prepare('SELECT * FROM user').all();
    console.log(`👤 Migrating ${users.length} users...`);
    for (const u of users) {
        await pgClient.query(
            `INSERT INTO "user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt", role)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [u.id, u.name, u.email, Boolean(u.emailVerified), u.image, u.createdAt, u.updatedAt, 'user']
        );
    }

    // Migrate accounts
    const accounts = sqlite.prepare('SELECT * FROM account').all();
    console.log(`🔑 Migrating ${accounts.length} accounts...`);
    for (const a of accounts) {
        await pgClient.query(
            `INSERT INTO account (id, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (id) DO NOTHING`,
            [a.id, a.accountId, a.providerId, a.userId, a.accessToken, a.refreshToken, a.idToken, a.accessTokenExpiresAt, a.refreshTokenExpiresAt, a.scope, a.password, a.createdAt, a.updatedAt]
        );
    }

    // Migrate sessions
    const sessions = sqlite.prepare('SELECT * FROM session').all();
    console.log(`🔐 Migrating ${sessions.length} sessions...`);
    for (const s of sessions) {
        await pgClient.query(
            `INSERT INTO session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (id) DO NOTHING`,
            [s.id, s.expiresAt, s.token, s.createdAt, s.updatedAt, s.ipAddress, s.userAgent, s.userId]
        );
    }

    // Migrate verification
    const verifications = sqlite.prepare('SELECT * FROM verification').all();
    console.log(`✅ Migrating ${verifications.length} verifications...`);
    for (const v of verifications) {
        await pgClient.query(
            `INSERT INTO verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (id) DO NOTHING`,
            [v.id, v.identifier, v.value, v.expiresAt, v.createdAt, v.updatedAt]
        );
    }

    // Migrate tournaments
    const tournaments = sqlite.prepare('SELECT * FROM tournament').all();
    console.log(`🏆 Migrating ${tournaments.length} tournaments...`);
    for (const t of tournaments) {
        await pgClient.query(
            `INSERT INTO tournament (id, "userId", name, status, data, "createdAt", "updatedAt", "isOfficial", "entryFee")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO NOTHING`,
            [t.id, t.userId, t.name, t.status, t.data, t.createdAt, t.updatedAt, false, 0]
        );
    }

    console.log('✅ Migration complete!');
    sqlite.close();
    await pgClient.end();
}

migrate().catch(console.error);
