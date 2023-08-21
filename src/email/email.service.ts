import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface options {
  to: string;
  subject: string;
  code: string;
}

const html = (code: string): string => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <title>Bluelancer OTP Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f0f0f0; margin: 0; padding: 0;">
    <table role="presentation" align="center" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px;">
      <tr>
        <td align="center" style="padding: 20px;">
          <h2 style="margin: 0; color: #333;">Bluelancer OTP Verification</h2>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px;">
          <p style="margin: 0; color: #555;">Your verification code is:</p>
          <h1 style="margin: 0; color: #007bff;">${code}</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px;">
          <p style="margin: 0; color: #555;">Thank you for choosing Bluelancer!</p>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px;">
          <p style="margin: 0; color: #888;">© 2023 Bluelancer. All rights reserved.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

@Injectable()
export default class EmailService {
  private nodemailerTransport: Transporter<SentMessageInfo>;
  private resend: Resend;
  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get('RESEND_API_KEY'));
    this.nodemailerTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendMail(options: options) {
    const user = options?.to;
    const subject = options?.subject;
    const code = options?.code;
    console.log(options)
    this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user,
      subject: subject,
      html: html(code),
    });
  }
}
