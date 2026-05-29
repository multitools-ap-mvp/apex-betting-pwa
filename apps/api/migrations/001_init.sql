-- Apex Betting PWA - Initial Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    daily_coins_claimed_at TIMESTAMPTZ
);

-- Coin balances
CREATE TABLE IF NOT EXISTS balances (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0 CHECK (amount >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction history (audit trail)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(30) NOT NULL CHECK (type IN ('welcome_bonus', 'daily_bonus', 'bet_placed', 'bet_won', 'bet_refunded', 'admin_adjustment', 'purchase')),
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reference_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    team_a VARCHAR(100) NOT NULL,
    team_b VARCHAR(100) NOT NULL,
    team_a_logo_url VARCHAR(500),
    team_b_logo_url VARCHAR(500),
    tournament VARCHAR(100),
    match_start_at TIMESTAMPTZ NOT NULL,
    betting_closes_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
    winner VARCHAR(10) CHECK (winner IN ('team_a', 'team_b', 'draw', NULL)),
    result_details JSONB DEFAULT '{}',
    house_fee_percent DECIMAL(4,2) DEFAULT 5.00,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Bets
CREATE TABLE IF NOT EXISTS bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    match_id UUID NOT NULL REFERENCES matches(id),
    picked_team VARCHAR(10) NOT NULL CHECK (picked_team IN ('team_a', 'team_b')),
    amount INTEGER NOT NULL CHECK (amount > 0),
    odds_at_bet DECIMAL(8,4) NOT NULL,
    potential_payout INTEGER,
    status VARCHAR(20) DEFAULT 'placed' CHECK (status IN ('placed', 'won', 'lost', 'cancelled', 'refunded')),
    placed_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bets_user ON bets(user_id, placed_at DESC);
CREATE INDEX IF NOT EXISTS idx_bets_match ON bets(match_id, status);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status, match_start_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger to auto-update balance timestamp
CREATE OR REPLACE FUNCTION update_balance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_balance ON balances;
CREATE TRIGGER trigger_update_balance
    BEFORE UPDATE ON balances
    FOR EACH ROW
    EXECUTE FUNCTION update_balance_timestamp();
