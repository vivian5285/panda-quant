import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { VerificationService } from '../services/verification.service';
import { User } from '../models/user.model';
import { DatabaseError, ValidationError } from '../utils/errors';
import { sendVerificationEmail } from '../utils/email';
import { validateEmail, validatePassword } from '../utils/validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
  };
}

interface UserRequestBody {
  email: string;
  password: string;
  name: string;
  code?: string;
}

const generateToken = (payload: { id: string; email: string }): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export class UserController {
  private userService: UserService;
  private verificationService: VerificationService;

  constructor() {
    this.userService = new UserService();
    this.verificationService = new VerificationService();
  }

  async sendCode(req: Request, res: Response) {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        return res.status(400).json({ message: 'Email and type are required' });
      }

      // 如果是注册，检查邮箱是否已存在
      if (type === 'register') {
        const existingUser = await this.userService.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: '该邮箱已被注册' });
        }
      }

      // 生成并发送验证码
      await this.verificationService.sendVerificationEmail(email, type);
      res.json({ message: '验证码已发送' });
    } catch (error) {
      console.error('Failed to send code:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, code } = req.body;

      if (!email || !password || !name || !code) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }

      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await hashPassword(password);
      const user = await this.userService.createUser({
        email,
        password: hashedPassword,
        name,
        isVerified: false
      });

      if (!user) {
        return res.status(500).json({ message: 'Failed to create user' });
      }

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Failed to register:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email first' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken({ id: user.id, email: user.email });

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Failed to login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async verifyEmail(req: Request, res: Response) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res.status(400).json({ message: 'Missing email or verification code' });
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: 'Email already verified' });
      }

      const isValid = await this.verificationService.verifyCode(email, code, 'register');
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }

      const updatedUser = await this.userService.updateUser(user.id, { isVerified: true });
      if (!updatedUser) {
        return res.status(500).json({ message: 'Failed to update user' });
      }

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error('Failed to verify email:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getProfile(req: RequestWithUser, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Failed to get profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateProfile(req: RequestWithUser, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Name is required' });
      }

      const user = await this.userService.updateUser(req.user.id, { name });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
} 