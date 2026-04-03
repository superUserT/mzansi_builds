import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  description!: string;
}