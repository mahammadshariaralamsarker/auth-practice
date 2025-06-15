import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSwapDto } from './dto/create-swap.dto';
import { UpdateSwapDto } from './dto/update-swap.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SwapService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSwapDto: CreateSwapDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: createSwapDto.user_id },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { id: createSwapDto.receiver_id },
    });

    if (!sender || !receiver) {
      throw new BadRequestException('Sender or Receiver does not exist');
    }
    const savedSwap = await this.prisma.swap.create({
      data: createSwapDto,
    });
    return { message: 'Swap created successful', data: savedSwap };
  }
  findAll() {
    return `This action returns all swap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} swap`;
  }

  update(id: number, updateSwapDto: UpdateSwapDto) {
    return `This action updates a #${id} swap`;
  }

  remove(id: number) {
    return `This action removes a #${id} swap`;
  }
}
