import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SwapModule } from './swap/swap.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UsersModule,
    CloudinaryModule,
    SwapModule,
  ],
})
export class AppModule {}
