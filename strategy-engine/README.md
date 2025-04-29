# Strategy Engine

The Strategy Engine is a core component of the Panda Quant platform that manages and executes trading strategies. It provides a robust framework for strategy development, backtesting, and live trading.

## Features

- Strategy Development Framework
- Backtesting Engine
- Live Trading Execution
- Performance Analytics
- Risk Management
- Market Data Integration
- Order Management
- Position Management

## Project Structure

```
strategy-engine/
├── src/
│   ├── core/           # Core engine components
│   │   ├── engine.ts   # Main engine class
│   │   ├── strategy.ts # Base strategy class
│   │   └── types.ts    # Core type definitions
│   ├── strategies/     # Strategy implementations
│   │   ├── grid/       # Grid trading strategy
│   │   ├── ma/         # Moving average strategy
│   │   └── momentum/   # Momentum strategy
│   ├── data/          # Market data handling
│   │   ├── feed.ts    # Data feed interface
│   │   └── store.ts   # Data storage
│   ├── analysis/      # Performance analysis
│   │   ├── metrics.ts # Performance metrics
│   │   └── report.ts  # Analysis reports
│   ├── risk/          # Risk management
│   │   ├── manager.ts # Risk manager
│   │   └── rules.ts   # Risk rules
│   └── utils/         # Utility functions
├── tests/             # Test files
└── examples/          # Example strategies
```

## Core Components

### Engine
The main engine class that manages strategy execution, data feeds, and order routing.

### Strategy
Base strategy class that all strategies must extend. Provides common functionality and lifecycle methods.

### Data Feed
Interface for market data providers. Supports real-time and historical data.

### Risk Manager
Manages position sizing, stop losses, and other risk controls.

## Strategy Development

1. Extend the base `Strategy` class
2. Implement required lifecycle methods
3. Define strategy parameters
4. Add risk management rules
5. Write tests
6. Backtest the strategy

Example strategy implementation:

```typescript
import { Strategy, StrategyConfig } from '../core/strategy';
import { MarketData, Order, Position } from '../core/types';

export class MyStrategy extends Strategy {
  constructor(config: StrategyConfig) {
    super(config);
    this.name = 'My Strategy';
    this.description = 'A custom trading strategy';
  }

  async initialize(): Promise<void> {
    // Initialize strategy
  }

  async onTick(data: MarketData): Promise<void> {
    // Process market data
  }

  async onOrder(order: Order): Promise<void> {
    // Handle order updates
  }

  async onPosition(position: Position): Promise<void> {
    // Handle position updates
  }
}
```

## Backtesting

The engine includes a comprehensive backtesting framework:

```typescript
import { Backtester } from '../core/backtester';
import { MyStrategy } from './my-strategy';

const strategy = new MyStrategy({
  // strategy parameters
});

const backtester = new Backtester({
  strategy,
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  symbol: 'BTC/USDT',
  initialBalance: 10000
});

const results = await backtester.run();
```

## Performance Metrics

- Sharpe Ratio
- Maximum Drawdown
- Win Rate
- Profit Factor
- Return on Investment (ROI)
- Risk-Adjusted Return
- Trade Statistics

## Risk Management

Built-in risk management features:

- Position Sizing
- Stop Loss
- Take Profit
- Maximum Drawdown
- Exposure Limits
- Risk per Trade
- Daily Loss Limits

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npm test
```

3. Start development:
```bash
npm run dev
```

## Configuration

Environment variables:
- `DATA_FEED_URL` - Market data feed URL
- `BROKER_API_KEY` - Broker API key
- `BROKER_SECRET` - Broker API secret
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests
5. Submit a pull request

## License

MIT 