apex-betting-pwa/
├── apps/
│   ├── web/                    # React PWA (Vite)
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI
│   │   │   ├── pages/          # Betting, Coins, Leaderboard, etc.
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── stores/         # Zustand state
│   │   │   └── services/       # API clients
│   │   └── public/
│   │       └── manifest.json   # PWA manifest
│   │
│   └── api/                    # Node.js backend
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.js
│       │   │   ├── bets.js
│       │   │   ├── matches.js
│       │   │   ├── coins.js
│       │   │   └── admin.js
│       │   ├── services/
│       │   │   ├── oddsEngine.js
│       │   │   ├── coinService.js
│       │   │   └── notificationService.js
│       │   ├── jobs/
│       │   │   └── dailyCoins.js   # BullMQ cron
│       │   └── models/         # Database schemas
│       └── tests/
│
├── packages/
│   └── shared-types/           # TypeScript types shared across apps
│
└── docker-compose.yml          # Local dev: Postgres + Redis
