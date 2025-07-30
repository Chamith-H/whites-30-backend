import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/config/decorators/public.decorator';
import { loginDto } from './dto/login.dto';
import { GetOtpDto } from './dto/get-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //!--> Login to system................................................................|
  @Public()
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: loginDto) {
    return await this.authService.login(dto);
  }

  //!--> Validate with front-end auth guard.............................................|
  @Get('access-route')
  async accessRoute() {
    return true;
  }

  //!--> Forgot password | get reset OTP...............................................|
  @Public()
  @HttpCode(200)
  @Post('get-otp')
  async getOtp(@Body() dto: GetOtpDto) {
    return await this.authService.sendOtp(dto);
  }

  //!--> Forgot password | Reset the password..........................................|
  @Public()
  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }
}
