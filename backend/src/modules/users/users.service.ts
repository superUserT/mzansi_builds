import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DirectMessage } from './entities/direct-message.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MailService } from '../../services/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(DirectMessage)
    private readonly messageRepository: Repository<DirectMessage>,
    private readonly mailService: MailService,
  ) {}

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'username', 'email', 'profilePictureUrl', 'linkedinUrl', 'portfolioUrl', 'createdAt'], 
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    await this.getProfile(userId); 
    await this.userRepository.update(userId, updateProfileDto);

    return this.getProfile(userId);
  }

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto): Promise<DirectMessage> {
    if (senderId === sendMessageDto.receiverId) {
      throw new BadRequestException('You cannot send a message to yourself');
    }

    const sender = await this.getProfile(senderId);
    
    const receiver = await this.userRepository.findOne({
      where: { id: sendMessageDto.receiverId },
      select: ['id', 'email', 'username'] 
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }
    
    const message = this.messageRepository.create({
      content: sendMessageDto.content,
      sender: { id: senderId },
      receiver: { id: sendMessageDto.receiverId },
    });

    const savedMessage = await this.messageRepository.save(message);

    await this.mailService.sendDirectMessageNotification(receiver.email, sender.username);

    return savedMessage;
  }
}