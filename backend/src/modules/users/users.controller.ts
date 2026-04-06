import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Inject,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { I_STORAGE_PROVIDER } from '../../services/storage/storage.provider.interface';
import type { IStorageProvider } from '../../services/storage/storage.provider.interface';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('api/users/profile')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(I_STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
  ) {}

  @Get()
  async getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch()
  async updateProfile(
    @Request() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(@Request() req: any, @UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = await this.storageProvider.uploadFile(
      file.originalname,
      file.buffer,
      file.mimetype,
    );

    return this.usersService.updateProfile(req.user.userId, {
      profilePictureUrl: imageUrl,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('messages')
  async sendMessage(
    @Request() req: any,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.usersService.sendMessage(req.user.userId, sendMessageDto);
  }

  @Get('directory')
  async getAllUsers() {
    return this.usersService.findAllForDirectory();
  }

  @UseGuards(JwtAuthGuard)
  @Get('messages')
  async getMessages(@Request() req: any) {
    return this.usersService.getMessages(req.user.userId);
  }

  @Post(':id/follow')
  async followUser(@Request() req: any, @Param('id') targetUserId: string) {
    return this.usersService.followUser(req.user.userId, targetUserId);
  }
}
