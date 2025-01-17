import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { otpCodeHtml } from '../lib/otpCodeHtml';

@Injectable()
export class UtilEmail {
  constructor(private configService: ConfigService) {}

  async send(message: string, email: string, subject: string) {
    const RESEND = this.configService.get('RESEND');
    const resend = new Resend(RESEND);
    const { error } = await resend.emails.send({
      from: 'info@blooma.io',
      to: email,
      subject,
      html: otpCodeHtml(message),
    });

    if (error) {
      throw new HttpException('failed-send-email', HttpStatus.CONFLICT);
    }
  }
}
