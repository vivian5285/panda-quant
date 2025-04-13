CREATE TABLE IF NOT EXISTS strategy_consistency_checks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  strategy_name VARCHAR(50) NOT NULL,
  check_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_consistent BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategy_consistency_checks_user_id ON strategy_consistency_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_consistency_checks_strategy_name ON strategy_consistency_checks(strategy_name);
CREATE INDEX IF NOT EXISTS idx_strategy_consistency_checks_check_time ON strategy_consistency_checks(check_time); 