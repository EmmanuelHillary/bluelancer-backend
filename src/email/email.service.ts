import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EmailService {
  private nodemailerTransport: Transporter<SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: nodemailer.SendMailOptions) {
    return this.nodemailerTransport.sendMail(options);
  }
}