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
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { I_STORAGE_PROVIDER } from '../../services/storage/storage.provider.interface';
import type { IStorageProvider } from '../../services/storage/storage.provider.interface';

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
  async uploadProfileImage(
    @Request() req: any,
    @UploadedFile() file: any, 
  ) {
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
}