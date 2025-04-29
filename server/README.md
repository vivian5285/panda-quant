# Panda Quant Server

This is the backend server for the Panda Quant trading platform. It provides APIs for user management, trading strategies, order execution, and various financial operations.

## Project Structure

```
server/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Express middlewares
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── tests/          # Test files
```

## Models

- `Alert` - System alerts and notifications
- `Commission` - Commission records for referrals
- `Deposit` - Cryptocurrency deposit records
- `Notification` - User notifications
- `Order` - Trading orders
- `Position` - Trading positions
- `Strategy` - Trading strategies
- `Transaction` - Financial transactions
- `User` - User accounts
- `UserLevel` - User level and privileges
- `Withdrawal` - Cryptocurrency withdrawal records

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start development server:
```bash
npm run dev
```

4. Run tests:
```bash
npm test
```

## API Documentation

The API documentation is available at `/api-docs` when running the server in development mode.

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `NODE_ENV` - Environment (development/production)

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code 