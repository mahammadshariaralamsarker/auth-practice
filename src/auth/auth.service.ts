/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constant';
import { Response, Request } from 'express';
import { MailService } from 'src/utils/nodemailer/mail.service';
import { LoginDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private mailService: MailService,
  ) {}
  //Register Account
  async register(dto: RegisterDto) {
    const { email, password, confirmPassword } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }
    if (password === confirmPassword) {
      // Generate OTP and store
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      await this.prisma.otp.create({
        data: {
          email,
          code: otpCode,
          password,
        },
      });

      await this.mailService.sendOtp(email, otpCode);
      return { message: 'OTP sent to your email' };
    }
  }
  // Verify otp for account create
  async verifyOtpAndCreateAccount(email: string, otp: number) {
    const otpEntry = await this.prisma.otp.findUnique({
      where: {
        email_code: {
          email,
          code: otp,
        },
      },
    });

    if (!otpEntry) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    //Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // Hash password
    if (!existingUser) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const hashedPassword = await this.hashPassword(otpEntry?.password);
      // Clean up
      await this.prisma.otp.deleteMany({
        where: { email },
      });
      // Create user
      await this.prisma.user.create({
        data: {
          email,
          hashedPassword,
        },
      });
      return { message: 'Account created successfully' };
    }
  }
  //login
  async login(dto: LoginDto, req: Request, res: Response) {
    const { email, password } = dto;
    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new BadRequestException('this user not found');
    }
    const ismatch = await this.comparePassword({
      password,
      hash: foundUser.hashedPassword,
    });
    if (!ismatch) {
      throw new BadRequestException('Password not matched');
    }
    const token = await this.singInToken({
      id: foundUser.id,
      email: foundUser.email,
    });
    if (!token) {
      throw new BadRequestException('Unauthorised');
    }
    res.cookie('token', token);
    res.send({ message: 'Loggin successfull' });
  }
  //Forgotten Password
  async forgottenPassword(email: string) {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new BadRequestException('User not found');
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    await this.prisma.otp2.deleteMany({ where: { email } });
    await this.prisma.otp2.create({
      data: {
        email,
        code: otpCode,
      },
    });
    const token = await this.singInToken({
      id: foundUser.id,
      email: foundUser.email,
    });
    await this.mailService.sendOtp(email, otpCode);
    return { message: 'OTP sent to your email', token };
  }

  // Verify otp for forgotten password
  async verifyOtpForForgottenPassword(
    email: string,
    code: number,
    token: string,
  ) {
    const decodedPayload = await this.decodeToken(token);
    console.log(decodedPayload);
    const user = await this.prisma.otp2.findFirst({
      where: { email: decodedPayload.email },
    });
    if (code !== user?.code) {
      return { message: 'otp verified failed ' };
    }
    const url = await this.singInToken({
      id: decodedPayload.id,
      email: user.email,
    });
    return {
      message: 'Otp verification successful',
      url: url,
    };
  }
  async changePassword(
    password: string,
    confirmPassword: string,
    token: string,
  ) {
    const decodedPayload = await this.decodeToken(token);
    const user = await this.prisma.user.findUnique({
      where: { id: decodedPayload.id },
    });
    if (password !== confirmPassword) {
      return { message: 'Password and confirm password not matched' };
    }
    if (password === confirmPassword) {
      const hashedPassword = await this.hashPassword(password);
      await this.prisma.user.update({
        where: { id: user?.id },
        data: { hashedPassword },
      });
    }
    return {
      message: 'password changed successful',
    };
  }
  //logout
  logout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Logged out Successfull' });
  }
  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }
  async comparePassword(args: {
    password: string;
    hash: string;
  }): Promise<boolean> {
    return await bcrypt.compare(args.password, args.hash);
  }
  async singInToken(args: { id: string; email: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
  async decodeToken(token: string): Promise<any> {
    try {
      const decoded = await this.jwt.verifyAsync(token, { secret: jwtSecret });
      return decoded;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return { message: 'Token authentication failed ' };
    }
  }
}
