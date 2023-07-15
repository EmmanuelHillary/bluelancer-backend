import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './schemas/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<User> {
    const user = await this.authService.signUp(signUpDto);
    await this.authService.sendVerificationOTP(signUpDto.email);
    return user;
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/validate-otp')
  async validateOTP(
    @Query('email') email: string,
    @Query('otp') otp: string,
  ): Promise<{ isValidOTP: boolean }> {
    const isValidOTP = await this.authService.validateOTP(email, otp);
    return { isValidOTP };
  }

  }
