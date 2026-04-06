import { IsString, IsOptional, IsUrl, IsArray, IsBoolean } from 'class-validator';

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

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Must be a valid URL' })
  githubUrl?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;
}