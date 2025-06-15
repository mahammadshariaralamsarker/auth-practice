import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/utils/nodemailer/mail.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { AuthGuard } from 'src/guard/auth.guard';

@Module({
  imports: [
    CloudinaryModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService, AuthGuard],
  exports: [JwtModule, AuthGuard],
})
export class AuthModule {}
