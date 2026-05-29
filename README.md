# Apex Betting PWA

Virtual currency betting platform for Apex Legends esports. Built with React 19, Node.js, PostgreSQL, and Docker.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 22+ (for local dev outside Docker)

### 1. Clone & Setup
```bash
git clone https://github.com/multitools-ap-mvp/apex-betting-pwa.git
cd apex-betting-pwa
cp .env.example .env
```

### 2. Start with Docker
```bash
# Start all services (Postgres, Redis, API, Web)
docker-compose up --build

# Or use npm script
npm run dev:build
```

### 3. Initialize Database
```bash
# In a new terminal, run migrations and seed
docker-compose exec api npm run migrate
docker-compose exec api npm run seed
```

### 4. Access the App
- **Web App**: http://localhost:5173
- **API**: http://localhost:3001
- **Admin Login**: `admin@apex-betting.com` / `Apex123`

## Development Commands

```bash
# Start everything
docker-compose up

# View API logs
docker-compose logs -f api

# View Web logs
docker-compose logs -f web

# Reset database (WARNING: deletes all data)
npm run db:reset

# Run migrations
docker-compose exec api npm run migrate

# Seed data
docker-compose exec api npm run seed
```

## Project Structure

```
apex-betting-pwa/
├── docker-compose.yml          # All services
├── apps/
│   ├── api/                    # Node.js 22 + Express backend
│   │   ├── src/
│   │   │   ├── config/         # DB + Redis config
│   │   │   ├── middleware/     # Auth, error handling
│   │   │   ├── routes/         # API endpoints
│   │   │   ├── services/       # Business logic
│   │   │   ├── jobs/           # BullMQ cron jobs
│   │   │   └── utils/          # Migrations, seed
│   │   └── migrations/         # SQL schema
│   └── web/                    # React 19 + Vite PWA
│       ├── src/
│       │   ├── components/     # Reusable UI
│       │   ├── pages/          # Route pages
│       │   ├── stores/         # Zustand state
│       │   ├── services/       # API client
│       │   └── lib/            # Utilities
│       └── public/             # PWA manifest, icons
└── packages/
    └── shared-types/           # Shared TypeScript types
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/matches | List matches |
| GET | /api/matches/:id | Get match details |
| POST | /api/bets | Place a bet |
| GET | /api/bets/my-bets | Get user's bets |
| GET | /api/coins | Get balance & history |
| POST | /api/coins/claim-daily | Claim daily 300 coins |
| GET | /api/leaderboard | Get leaderboard |
| POST | /api/admin/matches | Create match (admin) |
| POST | /api/admin/matches/:id/resolve | Resolve match (admin) |
| GET | /api/admin/users | List users (admin) |

## Features

- ✅ Email/password authentication with JWT
- ✅ 300 ApeXCoins daily claim
- ✅ Parimutuel betting with 5% house fee
- ✅ Real-time odds calculation
- ✅ Match creation & result resolution (admin)
- ✅ Transaction audit trail
- ✅ Leaderboard
- ✅ PWA support (offline caching)
- ✅ Apex Legends themed UI (red/black)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| State | Zustand, TanStack Query |
| Backend | Node.js 22, Express |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7, BullMQ |
| Container | Docker Compose |

## Roadmap

- [ ] OneSignal push notifications
- [ ] Stripe coin marketplace
- [ ] Automated match data from Liquipedia
- [ ] Advanced bet types (over/under, prop bets)
- [ ] Clan/team betting groups
- [ ] Seasonal tournaments with prizes

## License

MIT

---

**Disclaimer**: This is a fan-made project for entertainment purposes. Not affiliated with EA or Respawn Entertainment.
