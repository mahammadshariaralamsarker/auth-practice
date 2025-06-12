/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from 'src/utils/constant';
import { Response, Request } from 'express';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signup(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (foundUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    await this.prisma.user.create({
      data: {
        email,
        hashedPassword,
      },
    });

    return { message: 'Signup successful' };
  }

  async signin(dto: AuthDto, req: Request, res: Response) {
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
    //return { token };
  }

  signout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.send({ message: 'Loggedout Successfull' });
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
