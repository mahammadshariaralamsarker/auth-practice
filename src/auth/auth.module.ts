import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/utils/nodemailer/mail.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
})
export class AuthModule {}
