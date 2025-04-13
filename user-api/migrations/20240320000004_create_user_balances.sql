CREATE TABLE IF NOT EXISTS user_balances (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  frozen_balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_balances_balance ON user_balances(balance);
CREATE INDEX IF NOT EXISTS idx_user_balances_frozen_balance ON user_balances(frozen_balance); 