import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue('mail-queue') private mailQueue: Queue) {}

  async sendDirectMessageNotification(
    receiverEmail: string,
    senderName: string,
  ) {
    this.logger.log(`Adding email job to queue for ${receiverEmail}`);

    await this.mailQueue.add('send-dm-notification', {
      to: receiverEmail,
      subject: `New Message from ${senderName} on Mzansi Builds`,
      text: `Hello! You have received a new direct message from ${senderName}. Log in to Mzansi Builds to reply.`,
    });
  }
}
