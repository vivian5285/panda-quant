# User API

用户端 API 服务

## 📋 Features

- **User Authentication**: 
  - User registration with email verification
  - User login with JWT authentication
  - Password management (change, reset, forgot)
  - Email verification and resend verification
  - User profile management

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Email**: Nodemailer
- **Password Hashing**: bcrypt
- **Testing**: Jest with ts-jest
- **Language**: TypeScript

## 📁 Project Structure

```
src/
├── controllers/    # Route handlers
│   └── auth.controller.ts  # Authentication controller
├── services/       # Business logic
│   └── verification.service.ts  # Email verification service
├── models/         # Database models
│   └── User.ts     # User model
├── middleware/     # Express middleware
│   └── authenticate.ts  # JWT authentication middleware
├── utils/          # Utility functions
│   ├── jwt.ts      # JWT token handling
│   ├── password.ts # Password hashing with bcrypt
│   ├── email.ts    # Email sending with nodemailer
│   └── errors.ts   # Custom error classes
└── __tests__/     # Test files
    └── auth.test.ts  # Authentication tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 8+
- MongoDB 4.4+
- SMTP server for email verification

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/user-api

# JWT
JWT_SECRET=your-secret-key

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@example.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Development
npm run dev

# Production
npm start

# Run tests
npm test
```

## 🔧 API Endpoints

### Authentication

#### Register
- `POST /api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```
Response:
```json
{
  "message": "User registered successfully. Please check your email for verification."
}
```

#### Login
- `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Verify Email
- `POST /api/auth/verify-email`
```json
{
  "token": "verification-token"
}
```
Response:
```json
{
  "message": "Email verified successfully"
}
```

#### Resend Verification Email
- `POST /api/auth/resend-verification`
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "message": "Verification email sent"
}
```

#### Get Profile
- `GET /api/auth/profile`
- Requires authentication header: `Authorization: Bearer <token>`
Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### Update Profile
- `PUT /api/auth/profile`
- Requires authentication header: `Authorization: Bearer <token>`
```json
{
  "name": "New Name"
}
```
Response:
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "New Name"
  }
}
```

#### Change Password
- `POST /api/auth/change-password`
- Requires authentication header: `Authorization: Bearer <token>`
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```
Response:
```json
{
  "message": "Password updated successfully"
}
```

#### Forgot Password
- `POST /api/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "message": "Password reset email sent"
}
```

#### Reset Password
- `POST /api/auth/reset-password`
```json
{
  "token": "reset-token",
  "newPassword": "new-password"
}
```
Response:
```json
{
  "message": "Password reset successfully"
}
```

## 🔒 Security

### Authentication Flow

1. User registers with email and password
2. System sends verification email with 24-hour expiry token
3. User verifies email
4. User can login with credentials
5. System returns JWT token with 24-hour expiry
6. User includes token in subsequent requests

### Password Security

- Passwords are hashed using bcrypt with 10 salt rounds
- Password reset tokens expire in 1 hour
- Email verification tokens expire in 24 hours
- JWT tokens expire in 24 hours

### Error Handling

The API uses custom error classes for different scenarios:

- `ValidationError`: Input validation errors (400)
- `AuthenticationError`: Authentication failures (401)
- `AuthorizationError`: Authorization failures (403)
- `DatabaseError`: Database operation errors (409)
- `ServiceError`: Service-level errors (500)

## 📊 Database Schema

### User Model

```typescript
interface IUser {
  email: string;
  password: string;
  name: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🧪 Testing

The project uses Jest with ts-jest for testing and MongoDB memory server for database operations.

### Test Configuration

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['dotenv/config']
};
```

### Test Database Setup

The project includes scripts for test database initialization and test execution:

1. **Initialize Test Database** (`scripts/init-test-db.js`):
   - Connects to the test database
   - Clears existing data
   - Creates test users:
     - Verified user: test@example.com
     - Unverified user: unverified@example.com
   - Both users have password: test123

2. **Run Tests** (`scripts/run-tests.js`):
   - Loads test environment variables
   - Executes test suite
   - Provides detailed test output
   - Handles test failures appropriately

### Running Tests

```bash
# Initialize test database
node scripts/init-test-db.js

# Run tests
node scripts/run-tests.js

# Or use npm scripts
npm test
```

### Test Coverage

Tests cover:
- User registration
- User login
- Email verification
- Password management
- Profile management
- Error handling

### Test Environment

The test environment uses:
- Separate test database
- Test-specific environment variables
- Mocked email service
- Clean database state for each test run

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 