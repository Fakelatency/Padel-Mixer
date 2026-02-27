# Padel Mixer

A full-stack web application for organizing and managing padel tournaments. Supports multiple tournament formats, live score tracking, public leaderboards, photo galleries, user authentication, and an admin panel powered by Medusa v2.

---

## Features

- **Multiple tournament formats** — Americano, Mixed Americano, Team Americano, Mexicano, and Team Mexicano
- **Configurable scoring** — 16, 21, 24, or 32 points per match
- **Flexible rounds** — fixed number or unlimited
- **Custom ranking** — rank by points or by wins
- **Multi-court support** — run matches in parallel on multiple courts
- **Live score entry** — court-card interface with real-time input
- **User authentication** — register/login with email & password (better-auth)
- **Public player profiles** — link tournament players to registered accounts
- **Public leaderboards** — daily, weekly, monthly, overall — filter by all/official tournaments
- **Photo gallery** — upload, link to tournaments, lightbox viewer
- **Admin panel** — manage users, roles, and official tournaments (Medusa v2)
- **Shareable results** — generate URL to share tournament results
- **Quadrilingual** — Polish (default), English, German, Ukrainian

---

## Architecture

```
┌────────────────────────┐    ┌──────────────────────────┐
│   Next.js Frontend     │    │   Medusa v2 Backend      │
│   (Padel-Mixer)        │◄──►│   (padel-admin)          │
│   Port 3132            │    │   Port 9000              │
│                        │    │                          │
│   ├── Pages            │    │   ├── Tournament Module  │
│   ├── API Routes       │    │   ├── Store API          │
│   ├── Auth (better-auth│    │   ├── Admin API          │
│   └── Prisma (PG)      │    │   └── Admin UI (/app)    │
└────────┬───────────────┘    └──────────┬───────────────┘
         │                               │
         └──────────┬────────────────────┘
                    │
              ┌─────▼─────┐
              │ PostgreSQL │
              │            │
              │ padel_mixer│  (Next.js app)
              │ padel_admin│  (Medusa)
              └────────────┘
```

---

## Tech Stack

| Layer             | Technology                     |
| ----------------- | ------------------------------ |
| Framework         | Next.js 16 (Turbopack)         |
| Language          | TypeScript 5                   |
| UI Library        | React 19                       |
| Styling           | Tailwind CSS 4                 |
| State Management  | React Context + useReducer     |
| Database          | PostgreSQL 18                  |
| ORM               | Prisma 7 (with @prisma/adapter-pg) |
| Authentication    | better-auth                    |
| Admin Panel       | Medusa v2.13                   |
| Linting           | ESLint 9                       |

---

## Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** ≥ 15
- **npm** ≥ 10

---

## Getting Started

### 1. Clone and install

```bash
git clone <repository-url>
cd Padel-Mixer
npm install
```

### 2. Set up PostgreSQL

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE padel_mixer"
```

### 3. Configure environment

The `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/padel_mixer"
BETTER_AUTH_SECRET="your-random-secret-key"
BETTER_AUTH_URL="http://localhost:3132"
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Start development server

```bash
npm run dev
```

Open: **http://localhost:3132/padel/**

---

## Medusa Admin Panel (Optional)

The Medusa backend handles official tournament management. Located in `../padel-admin/`.

### Setup

```bash
cd padel-admin
npm install
npx medusa db:migrate
npx medusa user -e admin@example.com -p yourpassword
npx medusa develop
```

Admin UI: **http://localhost:9000/app**

---

## Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start dev server (port 3132)                   |
| `npm run build`  | Create optimized production build              |
| `npm run start`  | Serve production build                         |
| `npm run lint`   | Run ESLint                                     |

---

## API Routes

| Route                      | Method        | Description                          |
| -------------------------- | ------------- | ------------------------------------ |
| `/api/auth/[...all]`       | \*            | Authentication (better-auth)         |
| `/api/tournaments`         | GET, POST     | List/create tournaments              |
| `/api/tournaments/[id]`    | GET, PUT, DELETE | Manage tournament                 |
| `/api/leaderboard`         | GET           | Public leaderboard (period + type)   |
| `/api/photos`              | GET, POST     | List/upload photos                   |
| `/api/photos/[id]`         | DELETE        | Delete photo (admin)                 |
| `/api/player/[id]`         | GET           | Public player profile/stats          |
| `/api/user/stats`          | GET           | Authenticated user stats             |
| `/api/users/search`        | GET           | Search registered users              |
| `/api/admin/users`         | GET, PATCH, DELETE | Admin user management           |

---

## Project Structure

```
src/
  app/
    page.tsx                    — Home page (tournament list + nav)
    layout.tsx                  — Root layout with providers
    globals.css                 — Design system & tokens
    login/page.tsx              — Login page
    register/page.tsx           — Registration page
    profile/page.tsx            — User profile & stats
    leaderboard/page.tsx        — Public leaderboard
    gallery/page.tsx            — Photo gallery with lightbox
    results/page.tsx            — Shared results viewer
    tournament/
      new/page.tsx              — Tournament creation wizard
      [id]/page.tsx             — Active tournament (matches + scores)
      [id]/results/page.tsx     — Tournament results
    api/
      auth/[...all]/route.ts    — Auth endpoints
      tournaments/route.ts      — Tournament CRUD
      leaderboard/route.ts      — Leaderboard aggregation
      photos/route.ts           — Photo upload/list
      admin/users/route.ts      — Admin user management
  components/
    Header.tsx                  — Header with logo, language toggle, auth
  context/
    AppContext.tsx               — Global state management
  lib/
    types.ts                    — TypeScript definitions
    prisma.ts                   — Prisma client (PostgreSQL)
    auth.ts                     — better-auth configuration
    admin.ts                    — Admin middleware (requireAdmin)
    medusa-client.ts            — Medusa backend integration
    scheduler.ts                — Match scheduling algorithms
    scoring.ts                  — Scoring engine & standings
    share.ts                    — URL result sharing
    storage.ts                  — localStorage persistence
    i18n.ts                     — Translations (PL, EN, DE, UA)
prisma/
  schema.prisma                 — Database schema
  migrations/                   — PostgreSQL migrations
```

---

## Database Models

| Model       | Purpose                                    |
| ----------- | ------------------------------------------ |
| `user`      | Registered users with role (user/admin)    |
| `session`   | Active auth sessions                       |
| `account`   | OAuth/credential accounts                  |
| `tournament`| Saved tournaments (JSON data blob)         |
| `Photo`     | Gallery photos linked to tournaments       |

---

## Tournament Formats

| Format           | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| Americano        | Round-robin — every player partners with and plays against everyone      |
| Mixed Americano  | Teams always one male + one female                                       |
| Team Americano   | Fixed 2-player teams, round-robin                                        |
| Mexicano         | Dynamic pairing based on current standings                               |
| Team Mexicano    | Fixed teams, dynamic matchups by rankings                                |

---

## License

Private — all rights reserved.
