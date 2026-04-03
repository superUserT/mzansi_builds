import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Must be a valid URL' })
  linkedinUrl?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Must be a valid URL' })
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;
}