import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from '../../services/storage/storage.module';
import { DirectMessage } from './entities/direct-message.entity';
import { MailModule } from '../../services/mail/mail.module';
import { Follow } from './entities/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DirectMessage, Follow]), StorageModule, MailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule], 
})
export class UsersModule {}