import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //Register Router
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  // Login Router
  @Post('login')
  login(@Body() dto: LoginDto, @Req() req, @Res() res) {
    return this.authService.login(dto, req, res);
  }
  // verify otp for Register
  @Post('verify')
  verifyOtp(@Body() body: { email: string; otp: number }) {
    return this.authService.verifyOtpAndCreateAccount(body.email, body.otp);
  }

  @Get('logout')
  Logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }
}
