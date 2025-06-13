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
    console.log(email);
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
}
