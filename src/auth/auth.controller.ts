import { Body, Controller, Get, Post, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('signup')
  singup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  singin(@Body() dto: AuthDto, @Req() req, @Res() res) {
    return this.authService.signin(dto, req, res);
  }
  @Post('verify')
  verifyOtp(@Body() body: { email: string; otp: number }) {
    return this.authService.verifyOtpAndCreateAccount(body.email, body.otp);
  }
  @Get('signout')
  signout(@Req() req, @Res() res) {
    return this.authService.signout(req, res);
  }
}
