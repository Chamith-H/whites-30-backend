import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailSenderInterface } from './email-sender.interface';

@Injectable()
export class EmailSenderService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(bodyData: EmailSenderInterface) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: bodyData.receiver,
      subject: bodyData.heading,
      html: bodyData.template,
    };

    try {
      console.log(this.transporter);
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error occurred:', error);
      return false;
    }
  }
}
