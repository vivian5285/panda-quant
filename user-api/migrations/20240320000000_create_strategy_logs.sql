CREATE TABLE IF NOT EXISTS strategy_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  strategy_id VARCHAR(255) NOT NULL,
  profit DECIMAL(20,8) NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_strategy_logs_user_id ON strategy_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_strategy_logs_strategy_id ON strategy_logs(strategy_id);
CREATE INDEX IF NOT EXISTS idx_strategy_logs_executed_at ON strategy_logs(executed_at); 