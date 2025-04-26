-- 创建策略组合表
CREATE TABLE portfolios (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建策略组合-策略关联表
CREATE TABLE portfolio_strategies (
    id SERIAL PRIMARY KEY,
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    weight DECIMAL(10,4) NOT NULL CHECK (weight >= 0 AND weight <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(portfolio_id, strategy_id)
);

-- 创建策略优化结果表
CREATE TABLE optimization_results (
    id SERIAL PRIMARY KEY,
    strategy_id INTEGER REFERENCES strategies(id) ON DELETE CASCADE,
    params JSONB NOT NULL,
    total_profit DECIMAL(20,8) NOT NULL,
    max_drawdown DECIMAL(10,4) NOT NULL,
    win_rate DECIMAL(10,4) NOT NULL,
    sharpe_ratio DECIMAL(10,4),
    sortino_ratio DECIMAL(10,4),
    volatility DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_portfolio_strategies_portfolio_id ON portfolio_strategies(portfolio_id);
CREATE INDEX idx_portfolio_strategies_strategy_id ON portfolio_strategies(strategy_id);
CREATE INDEX idx_optimization_results_strategy_id ON optimization_results(strategy_id);
CREATE INDEX idx_optimization_results_total_profit ON optimization_results(total_profit DESC);

-- 添加触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加更新时间触发器
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_strategies_updated_at
    BEFORE UPDATE ON portfolio_strategies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 