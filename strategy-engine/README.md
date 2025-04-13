# Strategy Engine

The strategy engine is the core component of the Panda Quant platform, responsible for executing trading strategies and managing positions.

## 📋 Features

- **Strategy Implementation**: SuperTrend and other trading strategies
- **Market Analysis**: Real-time technical analysis
- **Position Management**: Automated trade execution
- **Risk Management**: Stop-loss and take-profit
- **Performance Tracking**: Detailed strategy statistics

## 🛠 Components

### Core Components

- `strategies/`: Strategy implementations
  - `superTrendStrategy.ts`: SuperTrend strategy
  - `baseStrategy.ts`: Base strategy class
- `utils/`: Utility functions
  - `indicators.ts`: Technical indicators
  - `backtest.ts`: Backtesting framework
- `types.ts`: TypeScript type definitions

### Strategy Interface

```typescript
interface Strategy {
  analyzeMarket(data: OHLCV[]): Promise<'buy' | 'sell' | 'hold'>;
  executeTrade(signal: 'buy' | 'sell', price: number): Promise<void>;
  getStats(): Promise<StrategyStats>;
}
```

## 📊 Technical Indicators

### Available Indicators

- ATR (Average True Range)
- SuperTrend
- Moving Averages
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)

### Usage Example

```typescript
import { calculateATR, calculateSuperTrend } from './utils/indicators';

const data: OHLCV[] = [...];
const atr = calculateATR(data, 14);
const superTrend = calculateSuperTrend(data, atr, 3);
```

## 🔧 Development

### Adding a New Strategy

1. Create a new strategy file in `strategies/`
2. Implement the `Strategy` interface
3. Add technical indicators if needed
4. Test with historical data
5. Add to strategy manager

### Example Strategy

```typescript
export class MyStrategy implements Strategy {
  constructor(private params: StrategyPreset) {}

  async analyzeMarket(data: OHLCV[]): Promise<'buy' | 'sell' | 'hold'> {
    // Implement market analysis
  }

  async executeTrade(signal: 'buy' | 'sell', price: number): Promise<void> {
    // Implement trade execution
  }

  async getStats(): Promise<StrategyStats> {
    // Implement statistics calculation
  }
}
```

## 📈 Backtesting

### Backtesting Framework

```typescript
import { Backtest } from './utils/backtest';

const backtest = new Backtest(strategy, historicalData);
const results = await backtest.run();
```

### Performance Metrics

- Total Return
- Win Rate
- Maximum Drawdown
- Sharpe Ratio
- Sortino Ratio

## 🔍 Testing

### Unit Tests

```bash
npm test
```

### Backtest Validation

```bash
npm run backtest
```

## 📚 Documentation

- [Strategy Development Guide](docs/strategy-development.md)
- [Technical Indicators](docs/indicators.md)
- [Backtesting Guide](docs/backtesting.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Implement and test your strategy
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 