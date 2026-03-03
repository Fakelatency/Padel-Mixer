// ─── White-Label Brand Configuration ────────────────────────
// To resell the app to a new padel club:
//   1. Edit the values below
//   2. Replace the logo & signet images in /public/
//   3. Rebuild
// ─────────────────────────────────────────────────────────────

export const brand = {
    // ─── Identity ─────────────────────────────────────────────
    clubName: 'Baza Padel Club',
    appTitle: 'Baza Padel Tournament',
    appDescription: 'Aplikacja do organizacji turniejów padel. Americano, Mexicano i więcej formatów turniejowych.',

    // ─── Assets (relative to public/) ─────────────────────────
    /** Full logo shown in header, login, register, home page */
    logoPath: '/baza-padel-logo.png',
    /** Small signet/icon used in loading spinners & watermarks */
    signetPath: '/baza-padel-sygnet.png',
    /** Favicon / apple-touch-icon */
    faviconPath: '/logo.jpg',

    // ─── Typography ───────────────────────────────────────────
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',

    // ─── Color Palette ────────────────────────────────────────
    colors: {
        /** Primary / background tones (mapped to Tailwind "navy-*") */
        primary: {
            950: '#060e1a',
            900: '#0a1929',
            800: '#0d2137',
            700: '#132f4c',
            600: '#1a3a5c',
            500: '#1e4976',
            400: '#2d6aa0',
            300: '#4d94d0',
            200: '#88bce8',
            100: '#c4def4',
        },
        /** Accent / CTA color (mapped to Tailwind "gold-*") */
        accent: {
            600: '#d4a017',
            500: '#f5c518',
            400: '#ffd740',
            300: '#ffe082',
        },
        /** Padel court card turf gradient colors */
        court: {
            center: '#4b9de2',
            edge: '#2a6f9e',
        },
        /** Semantic colors */
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
    },

    // ─── Icons / Emojis ──────────────────────────────────────
    icons: {
        /** Tournament format icons (shown on cards, setup, profiles) */
        formats: {
            americano: '🎾',
            mixedAmericano: '👫',
            teamAmericano: '👥',
            mexicano: '🌮',
            teamMexicano: '🏆',
        } as Record<string, string>,
        /** Podium / placement emojis */
        podium: {
            first: '🏆',
            second: '🥈',
            third: '🥉',
            placement1: '🥇',
            placement2: '🥈',
            placement3: '🥉',
        },
        /** Tab / navigation icons */
        tabs: {
            matches: '🎾',
            leaderboard: '🏆',
        },
        /** Status badge icons */
        status: {
            live: 'LIVE',
            completed: '✓',
            setup: '⚙',
        },
        /** Misc UI icons */
        misc: {
            tournament: '🏆',
            error: '😕',
            delete: '✕',
            checkmark: '✓',
            startTournament: '🎾',
        },
    },
} as const;

export type Brand = typeof brand;
