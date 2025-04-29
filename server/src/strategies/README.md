# Trading Strategies

This directory contains the implementation of various trading strategies for the Panda Quant platform.

## Strategy Structure

Each strategy should implement the following interface:

```typescript
interface IStrategy {
  name: string;
  description: string;
  parameters: Record<string, any>;
  initialize(): Promise<void>;
  onTick(data: MarketData): Promise<void>;
  onOrder(order: Order): Promise<void>;
  onPosition(position: Position): Promise<void>;
  onError(error: Error): Promise<void>;
}
```

## Available Strategies

1. Grid Trading Strategy
   - Implementation: `grid/GridStrategy.ts`
   - Description: A grid trading strategy that places buy and sell orders at regular price intervals
   - Parameters:
     - `gridSize`: Number of grids
     - `upperPrice`: Upper price limit
     - `lowerPrice`: Lower price limit
     - `investment`: Total investment amount

2. Moving Average Strategy
   - Implementation: `ma/MAStrategy.ts`
   - Description: A strategy based on moving average crossovers
   - Parameters:
     - `shortPeriod`: Short MA period
     - `longPeriod`: Long MA period
     - `amount`: Trading amount per order

3. Momentum Strategy
   - Implementation: `momentum/MomentumStrategy.ts`
   - Description: A momentum-based trading strategy
   - Parameters:
     - `period`: Lookback period
     - `threshold`: Signal threshold
     - `amount`: Trading amount per order

## Adding New Strategies

1. Create a new directory for your strategy
2. Implement the `IStrategy` interface
3. Add necessary tests
4. Update this README with strategy documentation

## Testing Strategies

Each strategy should have corresponding test files:

```bash
npm test -- --grep "Strategy Name"
```

## Backtesting

Use the backtesting framework to test strategies:

```typescript
import { Backtester } from '../utils/backtester';
import { YourStrategy } from './your-strategy';

const strategy = new YourStrategy({
  // strategy parameters
});

const backtester = new Backtester({
  strategy,
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  symbol: 'BTC/USDT'
});

const results = await backtester.run();
```

## Performance Metrics

- Sharpe Ratio
- Maximum Drawdown
- Win Rate
- Profit Factor
- Return on Investment (ROI)

## Risk Management

All strategies should implement proper risk management:

- Position sizing
- Stop loss
- Take profit
- Maximum drawdown protection
- Exposure limits 