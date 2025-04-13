import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseService {
  private static pool: Pool;

  // 初始化数据库连接池
  static initialize() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
      max: 20, // 最大连接数
      idleTimeoutMillis: 30000, // 空闲连接超时时间
      connectionTimeoutMillis: 2000, // 连接超时时间
    });

    // 监听连接错误
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  // 执行查询
  static async query(text: string, params?: any[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Executed query', { text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error executing query', { text, error });
      throw error;
    }
  }

  // 创建必要的表
  static async createTables() {
    try {
      // 创建历史数据表
      await this.query(`
        CREATE TABLE IF NOT EXISTS historical_data (
          id SERIAL PRIMARY KEY,
          symbol VARCHAR(20) NOT NULL,
          timeframe VARCHAR(10) NOT NULL,
          timestamp BIGINT NOT NULL,
          open DECIMAL NOT NULL,
          high DECIMAL NOT NULL,
          low DECIMAL NOT NULL,
          close DECIMAL NOT NULL,
          volume DECIMAL NOT NULL,
          UNIQUE(symbol, timeframe, timestamp)
        );
      `);

      // 创建回测结果表
      await this.query(`
        CREATE TABLE IF NOT EXISTS backtest_results (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          strategy_name VARCHAR(50) NOT NULL,
          risk_level VARCHAR(20) NOT NULL,
          symbol VARCHAR(20) NOT NULL,
          timeframe VARCHAR(10) NOT NULL,
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          initial_capital DECIMAL NOT NULL,
          final_capital DECIMAL NOT NULL,
          total_profit DECIMAL NOT NULL,
          profit_percentage DECIMAL NOT NULL,
          monthly_return DECIMAL NOT NULL,
          max_drawdown DECIMAL NOT NULL,
          win_rate DECIMAL NOT NULL,
          total_trades INTEGER NOT NULL,
          winning_trades INTEGER NOT NULL,
          losing_trades INTEGER NOT NULL,
          average_profit DECIMAL NOT NULL,
          average_loss DECIMAL NOT NULL,
          profit_factor DECIMAL NOT NULL,
          sharpe_ratio DECIMAL NOT NULL,
          sortino_ratio DECIMAL NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
      `);

      // 创建回测交易记录表
      await this.query(`
        CREATE TABLE IF NOT EXISTS backtest_trades (
          id SERIAL PRIMARY KEY,
          backtest_id INTEGER NOT NULL,
          entry_time TIMESTAMP NOT NULL,
          exit_time TIMESTAMP NOT NULL,
          entry_price DECIMAL NOT NULL,
          exit_price DECIMAL NOT NULL,
          profit DECIMAL NOT NULL,
          type VARCHAR(10) NOT NULL,
          FOREIGN KEY (backtest_id) REFERENCES backtest_results(id)
        );
      `);

      // 创建索引
      await this.query(`
        CREATE INDEX IF NOT EXISTS idx_historical_data_symbol_timeframe 
        ON historical_data(symbol, timeframe);
        
        CREATE INDEX IF NOT EXISTS idx_historical_data_timestamp 
        ON historical_data(timestamp);
        
        CREATE INDEX IF NOT EXISTS idx_backtest_results_user_id 
        ON backtest_results(user_id);
        
        CREATE INDEX IF NOT EXISTS idx_backtest_trades_backtest_id 
        ON backtest_trades(backtest_id);
      `);

      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating database tables:', error);
      throw error;
    }
  }

  // 关闭数据库连接
  static async close() {
    await this.pool.end();
  }
} 