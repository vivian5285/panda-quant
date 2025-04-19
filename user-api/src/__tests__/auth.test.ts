import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthController } from '../controllers/auth.controller';
import { UserModel } from '../models/User';
import { hashPassword } from '../utils/password';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('AuthController', () => {
  let authController: AuthController;
  let userModel: UserModel;

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
    authController = new AuthController();
    userModel = new UserModel();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User registered successfully. Please check your email for verification.'
      });

      const user = await userModel.findUserByEmail('test@example.com');
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
      expect(user?.name).toBe('Test User');
      expect(user?.isVerified).toBe(false);
    });

    it('should not register a user with missing fields', async () => {
      const req = {
        body: {
          email: 'test@example.com'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.register(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const hashedPassword = await hashPassword('password123');
      await userModel.createUser({
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        isVerified: true
      });
    });

    it('should login successfully with correct credentials', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        json: jest.fn()
      };

      await authController.login(req as any, res as any);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.token).toBeTruthy();
      expect(response.user.email).toBe('test@example.com');
      expect(response.user.name).toBe('Test User');
    });

    it('should not login with incorrect password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'wrongpassword'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials'
      });
    });

    it('should not login unverified user', async () => {
      await userModel.updateUser(
        (await userModel.findUserByEmail('test@example.com'))?._id.toString() || '',
        { isVerified: false }
      );

      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await authController.login(req as any, res as any);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Please verify your email first'
      });
    });
  });
}); 