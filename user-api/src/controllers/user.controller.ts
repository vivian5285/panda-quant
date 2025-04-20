import { Controller, Post, Body, HttpException, HttpStatus, Request, Response } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { VerificationService } from '../services/verification.service';
import { User, UserModel } from '../models/user.model';
import { DatabaseError, ValidationError } from '../utils/errors';
import { sendVerificationEmail } from '../utils/email';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { validateEmail, validatePassword } from '../utils/validation';
import bcrypt from 'bcrypt';

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

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService
  ) {}

  @Post('send-code')
  async sendCode(@Body() body: { email: string; type: 'register' | 'reset-password' }) {
    const { email, type } = body;

    // 如果是注册，检查邮箱是否已存在
    if (type === 'register') {
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
      }
    }

    // 生成并发送验证码
    await this.verificationService.sendVerificationEmail(email, type);
    return { message: '验证码已发送' };
  }

  @Post('register')
  async register(@Body() body: UserRequestBody): Promise<{ message: string; user: Partial<User> }> {
    const { email, password, name } = body;

    if (!email || !password || !name) {
      throw new HttpException('Missing required fields', HttpStatus.BAD_REQUEST);
    }

    if (!validateEmail(email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    if (!validatePassword(password)) {
      throw new HttpException('Password must be at least 8 characters long', HttpStatus.BAD_REQUEST);
    }

    const existingUser = await this.userService.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already registered', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hashPassword(password);
    const verificationCode = Math.random().toString(36).substring(2, 8);

    const user = await this.userService.createUser({
      email,
      password: hashedPassword,
      name,
      verificationCode,
      isVerified: false
    });

    await sendVerificationEmail(email, verificationCode);

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  @Post('login')
  async login(@Body() body: Pick<UserRequestBody, 'email' | 'password'>): Promise<{ message: string; token: string; user: Partial<User> }> {
    const { email, password } = body;

    if (!email || !password) {
      throw new HttpException('Missing email or password', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.isVerified) {
      throw new HttpException('Please verify your email first', HttpStatus.FORBIDDEN);
    }

    const isPasswordValid = await this.userService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string; code: string }) {
    const { email, newPassword, code } = body;

    const isValid = await this.verificationService.verifyCode(email, code, 'reset-password');
    if (!isValid) {
      throw new HttpException('验证码无效或已过期', HttpStatus.BAD_REQUEST);
    }

    await this.userService.updateUser(email, { password: await hashPassword(newPassword) });
    return { message: '密码重置成功' };
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: Pick<UserRequestBody, 'email' | 'code'>): Promise<{ message: string }> {
    const { email, code } = body;

    if (!email || !code) {
      throw new HttpException('Missing email or verification code', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException('Email already verified', HttpStatus.BAD_REQUEST);
    }

    if (user.verificationCode !== code) {
      throw new HttpException('Invalid verification code', HttpStatus.BAD_REQUEST);
    }

    await this.userService.updateUser(user.id, { isVerified: true, verificationCode: undefined });

    return { message: 'Email verified successfully' };
  }

  @Post('profile')
  async getProfile(@Request() req: RequestWithUser): Promise<{ user: Partial<User> }> {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const user = await UserService.getUserById(req.user.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  @Post('profile/update')
  async updateProfile(
    @Request() req: RequestWithUser,
    @Body() body: Pick<UserRequestBody, 'name'>
  ): Promise<{ message: string; user: Partial<User> }> {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const { name } = body;
    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.userService.updateUser(req.user.id, { name });
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    };
  }
} 