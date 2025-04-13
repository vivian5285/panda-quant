# User API

The backend API for the Panda Quant platform, built with Node.js and Express.

## 📋 Features

- **User Management**: Registration and authentication
- **Asset Management**: Deposit and withdrawal processing
- **Strategy Management**: Strategy creation and execution
- **Transaction Processing**: Multi-chain support
- **Real-time Updates**: WebSocket integration
- **Security**: JWT authentication and rate limiting

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Real-time**: WebSocket
- **Testing**: Jest
- **Documentation**: Swagger

## 📁 Project Structure

```
src/
├── routes/         # API routes
├── controllers/    # Route handlers
├── services/       # Business logic
├── models/         # Database models
├── middleware/     # Express middleware
├── utils/          # Utility functions
└── types/          # TypeScript types
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- PostgreSQL >= 14.x
- npm >= 7.x

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## 📦 Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run migrate`: Run database migrations
- `npm run seed`: Seed database with test data

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout

### Asset Management

- `GET /api/asset/balance`: Get user balance
- `POST /api/asset/deposit`: Submit deposit
- `POST /api/asset/withdraw`: Request withdrawal
- `GET /api/asset/transactions`: Get transaction history

### Strategy Management

- `POST /api/strategy/create`: Create new strategy
- `GET /api/strategy/list`: Get user strategies
- `PUT /api/strategy/:id/params`: Update strategy parameters
- `DELETE /api/strategy/:id`: Delete strategy

## 🔒 Security

### Authentication

```typescript
// JWT middleware
const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token provided');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

### Rate Limiting

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## 📊 Database

### Models

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  balance   Decimal
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Transaction {
  id        String   @id @default(uuid())
  userId    String
  type      String
  amount    Decimal
  status    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migrations

```bash
# Create new migration
npm run migrate:create

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Security Guide](docs/security.md)
- [Testing Guide](docs/testing.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 