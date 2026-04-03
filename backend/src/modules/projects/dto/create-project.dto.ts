import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  stage!: string;

  @IsString()
  @IsOptional()
  supportRequired?: string;

  @IsUrl()
  @IsOptional()
  githubLink?: string;

  @IsUrl()
  @IsOptional()
  liveLink?: string;
}