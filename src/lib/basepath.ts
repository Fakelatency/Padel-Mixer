/**
 * Central basePath constant for the app.
 *
 * In Next.js, `next.config.ts` reads `basePath` at build time.
 * Client-side code cannot import next.config directly, so we expose
 * the same value via `NEXT_PUBLIC_BASE_PATH`.
 *
 * Change this ONE place (+ next.config.ts + .env) when migrating paths.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '/turnieje';
