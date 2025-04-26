# Strategy Engine

A high-performance, real-time trading strategy execution engine for quantitative trading.

## Features

- **Real-time Market Data Processing**
  - WebSocket-based market data streaming
  - Redis caching for performance optimization
  - Automatic reconnection and error handling

- **Strategy Execution**
  - Support for multiple strategy types
  - Concurrent strategy execution
  - Risk management and position sizing
  - Order management and tracking

- **Performance Monitoring**
  - Real-time metrics collection
  - Customizable alert rules
  - Historical performance analysis
  - System health monitoring

- **Testing**
  - Comprehensive unit tests
  - Integration tests
  - End-to-end tests
  - Performance benchmarks

## Architecture

```
strategy-engine/
├── src/
│   ├── engine/           # Core strategy execution engine
│   ├── services/         # Business logic services
│   ├── interfaces/       # Type definitions
│   ├── utils/            # Utility functions
│   ├── monitoring/       # Monitoring and metrics
│   └── __tests__/        # Test suites
├── config/              # Configuration files
└── docs/               # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 14
- Redis >= 6
- Docker (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/strategy-engine.git
cd strategy-engine
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start Redis:
```bash
docker run -d -p 6379:6379 redis
```

5. Start the engine:
```bash
npm start
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `WS_URL` | WebSocket URL | ws://localhost:8080 |
| `MAX_CONCURRENT_STRATEGIES` | Maximum concurrent strategies | 10 |
| `EXECUTION_INTERVAL` | Strategy execution interval (ms) | 1000 |

### Strategy Configuration

Strategies can be configured through the admin interface or by editing the configuration files in `config/strategies/`.

Example strategy configuration:
```json
{
  "name": "SuperTrend",
  "type": "technical",
  "parameters": {
    "period": 10,
    "multiplier": 3
  },
  "risk": {
    "maxPositionSize": 10000,
    "maxDrawdown": 0.1
  }
}
```

## API Documentation

### Strategy Execution

```typescript
interface StrategyExecutionRequest {
  strategyId: string;
  userId: string;
  parameters: Record<string, any>;
}

interface StrategyExecutionResponse {
  executionId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}
```

### Market Data

```typescript
interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}
```

### Monitoring

```typescript
interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

interface AlertRule {
  id: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'neq';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  description: string;
}
```

## Testing

### Unit Tests

```bash
npm test
```

### Integration Tests

```bash
npm run test:integration
```

### End-to-End Tests

```bash
npm run test:e2e
```

## Monitoring and Alerts

The engine provides comprehensive monitoring capabilities:

1. **System Metrics**
   - CPU usage
   - Memory usage
   - Network latency
   - Disk I/O

2. **Strategy Metrics**
   - Execution time
   - Error rate
   - Profit/loss
   - Drawdown

3. **Alert Rules**
   - Customizable thresholds
   - Multiple severity levels
   - Email/SMS notifications

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team at support@example.com. 