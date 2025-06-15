// src/auth/auth.guard.ts

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
export type JwtPayload = {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
};
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(authHeader);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request['user'] = payload;
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
