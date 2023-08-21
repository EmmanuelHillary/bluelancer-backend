import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter, SentMessageInfo } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

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
  private logger = new Logger('EmailService');
  constructor(private readonly configService: ConfigService) {}

  async sendMail(options: options) {
    this.logger.log(`Email Function`)
    const RESEND_API_KEY = this.configService.get('RESEND_API_KEY');
    const user = options?.to;
    const subject = options?.subject;
    const code = options?.code;
    this.logger.log(`Sending Email ${JSON.stringify(options, null, 2)}`)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Bluelancer <onboarding@resend.dev>',
        to: [user],
        subject: subject,
        html: html(code),
      }),
    });
    this.logger.log(`Email sent`)
    if (res.ok) {
      const data = await res.json();
      this.logger.log(`Email Response :-> ${JSON.stringify(data, null, 2)}`)
      return data;
    }
  }
}
