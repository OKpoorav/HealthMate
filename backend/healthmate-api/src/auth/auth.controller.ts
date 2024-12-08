import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('Login attempt');
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    this.logger.log('Registration attempt');
    try {
      const result = await this.authService.register(registerDto);
      this.logger.log('Registration successful');
      return result;
    } catch (error) {
      this.logger.error('Registration failed', error);
      throw error;
    }
  }
}
