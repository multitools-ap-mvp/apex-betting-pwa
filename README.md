# Apex Betting PWA

**Current Version**
**V0.3.0 MVP**
**Built By: Apex Multi Tools**
---

**Apex Multi Tools: Apex Virtual Betting Platform**

This PWA App is the gateway to our brand new one of a kind,
Virtual Currency betting platform for Esport only.
We are still in Beta Development, Beta is limited to only Apex Legends Esports,
and all its Tournaments! 
Future Version will offer betting on ALL Major Esports! Key Properties

Odds are dynamic — they shift as more money flows in up until the event starts.
No fixed odds — unlike traditional bookmaking where odds are set in advance.

Beta will be open for Apex Pro League & Upcomming EWC Lan.

Apex Betting has all the same functions as major "real" betting sites, Like Live realtime odds, 
Player & Teams data, Fast payout & Discussion forum where you can argue with other nerds about what the best team is.
Also Live Leaderboard top 10 for the best of the best! All this is done with our own eko system built on our own virtual Currency,

**ApeXCoins**
A virtual Currency that lives within a Redis database. All transactions are handeled by this Redis instance.
All users get 300 ApeXCoins credited to there account every 24H to keep the economy flowing. 

# Parimutuel Betting

Our betting process are abit different then "Standard" Betting with fixed odds.
````
Parimutuel betting is a system where all bets on a game are pooled together, 
and winners share the pool proportionally.
— the odds aren't fixed in advance, they're determined by how people bet.
So bet on your team = Change the odds.
````
````
The pool — when a match starts, all 20 teams go into the pool and betting is closed.
Other bettors have already placed money on there team. The more a team is favored by the crowd, the lower the odds — because more people are splitting the same payout pool.

Your payout — if your team wins, you get back (your bet / all bets on that team) × payout pool.
A team with fewer bets on them pays out much more if they pull off the upset.
The odds move live — as more people bet, the odds shift.
````
---

 ---
**Tech Stack**

Built with: 
* React 19
* Node.js
* PostgreSQL
* Redis
* Docker Option

---
## Quick Start

**Apex Betting Works on any OS as a PWA App or Docker
Just press "Setup App to Desktop" And you will have a launch Icon on:**

Windows - Linux - Termux/Android & iOS.

---


### Prerequisites - (This will be updated when Beta go live.)
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

# Or Or use our install Script that work on any OS.
python -l setupapp.py
```

### 3. Initialize Database
```bash
# In a new terminal, run migrations and seed

docker-compose exec api npm run migrate
docker-compose exec api npm run seed
```

### 4. Access the App
- **Web App**: http://localhost:5173 (https://betting.apexmultitools.se/)
- **API**: http://localhost:3001 (https://apexmultitools.se/v1/api)

## Features

- ✅ Secure Email/password authentication with JWT
- ✅ 300 ApeXCoins daily claim
- ✅ Parimutuel betting with 5% house fee
- ✅ Real-time odds calculation
- ✅ Match creation & result resolution (admin)
- ✅ Transaction audit trail
- ✅ Leaderboard
- ✅ PWA support (offline caching)
- ✅ Apex Legends

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS v4 |
| State | Zustand, TanStack Query |
| Backend | Node.js 22, Express |
| Database | PostgreSQL 16 |
| Cache/Queue | Redis 7, BullMQ |
| Container | Docker Compose |


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

````
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
````

## Roadmap To V1.0.0

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
