-- Users table to store profile and authentication info
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(5) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    wallet_address VARCHAR(42) UNIQUE,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat history for the AI assistant
CREATE TABLE IF NOT EXISTS chat_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL, -- 'user' or 'assistant'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Groups for "Nabung Bareng"
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    admin_id INTEGER REFERENCES users(id),
    contract_address VARCHAR(42), -- Address of the deployed GroupVault
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Group Members
CREATE TABLE IF NOT EXISTS group_members (
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id)
);

-- Positions (KITA Vault & Group Vault investments)
CREATE TABLE IF NOT EXISTS positions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id), -- Nullable, if it's a solo position
    vault_address VARCHAR(42) NOT NULL,
    asset_symbol VARCHAR(10) NOT NULL, -- e.g., 'WETH', 'WBTC'
    amount NUMERIC(30, 0) NOT NULL,
    strike_price NUMERIC(30, 0) NOT NULL,
    expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    is_call BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, FILLED, EXPIRED, CLOSED
    tx_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_chat_user ON chat_history(user_id);
CREATE INDEX idx_positions_user ON positions(user_id);
-- Grant permissions to nunggu_user
GRANT USAGE ON SCHEMA public TO nunggu_user;
GRANT CREATE ON SCHEMA public TO nunggu_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO nunggu_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO nunggu_user;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO nunggu_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO nunggu_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO nunggu_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO nunggu_user;