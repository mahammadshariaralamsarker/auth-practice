import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { PrismaModule } from 'prisma/prisma.module';
// import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [SwapController],
  providers: [SwapService],
})
export class SwapModule {}
