import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import * as nodemailer from 'nodemailer';

@Processor('mail-queue')
export class MailProcessor extends WorkerHost {
  private readonly logger = new Logger(MailProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    super();
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'send-dm-notification':
        await this.handleSendEmail(job.data);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleSendEmail(data: { to: string; subject: string; text: string }) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('SMTP_FROM_EMAIL', 'noreply@mzansibuilds.local'),
        to: data.to,
        subject: data.subject,
        text: data.text,
      });
      this.logger.log(`Email successfully sent to ${data.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}`, error);
      throw error;
    }
  }
}