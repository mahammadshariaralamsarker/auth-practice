import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  Req,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //Register Router
  @Post('register')
  @UseInterceptors(FileInterceptor('image'))
  register(
    @UploadedFile() file: Express.Multer.File,
    @Body('data') data:string,
  ) {
    return this.authService.register(data, file);
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
  @Post('forgottenPassword')
  forgottenPassword(@Body() body: { email: string }) {
    return this.authService.forgottenPassword(body.email);
  }
  // verify otp for ForgottenPassword
  @Post('verifyandforgottenpassword/:token')
  verifyOtpAndForgottenPassword(
    @Param('token') token: string,
    @Body() body: { email: string; code: number; token: string },
  ) {
    return this.authService.verifyOtpForForgottenPassword(
      body.email,
      body.code,
      token,
    );
  }
  // change password
  @Post('changePassword/:token')
  changePassword(
    @Param('token') token: string,
    @Body() body: { password: string; confirmPassword: string; token: string },
  ) {
    return this.authService.changePassword(
      body.password,
      body.confirmPassword,
      token,
    );
  }
  @Get('logout')
  Logout(@Req() req, @Res() res) {
    return this.authService.logout(req, res);
  }
}
