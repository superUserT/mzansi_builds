import { IsNotEmpty, IsString, IsOptional, IsUrl, IsArray, IsEnum } from 'class-validator';
import { ProjectStage } from '../entities/project.entity';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(ProjectStage)
  @IsNotEmpty()
  stage!: ProjectStage;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportRequired?: string[];

  @IsUrl()
  @IsOptional()
  githubLink?: string;

  @IsUrl()
  @IsOptional()
  liveLink?: string;
}