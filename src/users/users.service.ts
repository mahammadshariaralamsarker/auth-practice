/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: PrismaService) {}
  findAll() {
    return this.databaseService.user.findMany({});
  }

  findOne(id: string) {
    return this.databaseService.user.findUnique({
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
