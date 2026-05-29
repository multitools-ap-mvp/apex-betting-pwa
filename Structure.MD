# Tree
---

**apex-betting-pwa/**
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



---

# API Endpoints


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

---


