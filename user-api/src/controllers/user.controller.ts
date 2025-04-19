import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { VerificationService } from '../services/verification.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly verificationService: VerificationService
  ) {}

  @Post('send-code')
  async sendCode(@Body() body: { email: string; type: 'register' | 'login' | 'reset' }) {
    const { email, type } = body;

    // 如果是注册，检查邮箱是否已存在
    if (type === 'register') {
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        throw new HttpException('该邮箱已被注册', HttpStatus.BAD_REQUEST);
      }
    }

    // 生成并发送验证码
    await this.verificationService.generateCode(type, email);
    return { message: '验证码已发送' };
  }

  @Post('register')
  async register(@Body() body: { email: string; password: string; code: string }) {
    const { email, password, code } = body;

    // 验证验证码
    const isValid = await this.verificationService.verifyCode('register', email, code);
    if (!isValid) {
      throw new HttpException('验证码无效或已过期', HttpStatus.BAD_REQUEST);
    }

    // 创建用户
    const user = await this.userService.createUser(email, password);
    return { message: '注册成功', user };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string; code: string }) {
    const { email, password, code } = body;

    // 验证验证码
    const isValid = await this.verificationService.verifyCode('login', email, code);
    if (!isValid) {
      throw new HttpException('验证码无效或已过期', HttpStatus.BAD_REQUEST);
    }

    // 验证用户
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new HttpException('邮箱或密码错误', HttpStatus.UNAUTHORIZED);
    }

    return { message: '登录成功', user };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string; code: string }) {
    const { email, newPassword, code } = body;

    // 验证验证码
    const isValid = await this.verificationService.verifyCode('reset', email, code);
    if (!isValid) {
      throw new HttpException('验证码无效或已过期', HttpStatus.BAD_REQUEST);
    }

    // 重置密码
    await this.userService.resetPassword(email, newPassword);
    return { message: '密码重置成功' };
  }
} 