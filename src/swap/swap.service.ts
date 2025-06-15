import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSwapDto } from './dto/create-swap.dto';
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
  myCurrentStatus(authHeader: string) {
    console.log(authHeader);
    return `This action returns all swap`;
  }

  findOne(id: number) {
    return `This action returns a #${id} swap`;
  }

  async updateStatus(id: string, status: 'accepted' | 'rejected' | 'pending') {
    console.log(id);
    const swaps = await this.prisma.swap.findFirst({
      where: {
        receiver_id: id,
        status: 'pending',
      },
    });
    if (!swaps) {
      throw new BadRequestException('Sender or Receiver does not exist');
    }

    const update = await this.prisma.swap.update({
      where: { id: swaps.id },
      data: { status: status },
    });
    return { message: 'Status Updated Successfully', data: update };
  }

  remove(id: number) {
    return `This action removes a #${id} swap`;
  }
}
