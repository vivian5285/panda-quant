-- 策略表
CREATE TABLE IF NOT EXISTS strategies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    params JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 历史数据表
CREATE TABLE IF NOT EXISTS historical_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    timestamp BIGINT NOT NULL,
    open DECIMAL(20, 8) NOT NULL,
    high DECIMAL(20, 8) NOT NULL,
    low DECIMAL(20, 8) NOT NULL,
    close DECIMAL(20, 8) NOT NULL,
    volume DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回测结果表
CREATE TABLE IF NOT EXISTS backtest_results (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT NOT NULL,
    total_profit DECIMAL(20, 8) NOT NULL,
    max_drawdown DECIMAL(10, 4) NOT NULL,
    win_rate DECIMAL(10, 4) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 回测交易记录表
CREATE TABLE IF NOT EXISTS backtest_trades (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL,
    timestamp BIGINT NOT NULL,
    type VARCHAR(10) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    quantity DECIMAL(20, 8) NOT NULL,
    profit DECIMAL(20, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 策略监控表
CREATE TABLE IF NOT EXISTS strategy_monitors (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    threshold DECIMAL(20, 8) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 报警记录表
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    strategy_id VARCHAR(50) NOT NULL,
    monitor_id INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(20, 8) NOT NULL,
    threshold DECIMAL(20, 8) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_historical_data_symbol_timeframe ON historical_data(symbol, timeframe);
CREATE INDEX IF NOT EXISTS idx_historical_data_timestamp ON historical_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_backtest_trades_strategy_id ON backtest_trades(strategy_id);
CREATE INDEX IF NOT EXISTS idx_backtest_trades_timestamp ON backtest_trades(timestamp);
CREATE INDEX IF NOT EXISTS idx_strategy_monitors_strategy_id ON strategy_monitors(strategy_id);
CREATE INDEX IF NOT EXISTS idx_alerts_strategy_id ON alerts(strategy_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at); 