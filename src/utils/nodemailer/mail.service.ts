/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mahammadshariaralam@gmail.com',
      pass: 'ngosgbhfypxfccln',
    },
  });

  async sendOtp(email: string, otp: number) {
    const mailOptions = {
      from: 'mahammadshariaralam@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
