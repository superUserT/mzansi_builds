import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StorageModule } from '../../services/storage/storage.module';
import { DirectMessage } from './entities/direct-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DirectMessage]), StorageModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule], 
})
export class UsersModule {}