import { IsNotEmpty, IsString } from 'class-validator';

export class AddMilestoneDto {
  @IsString()
  @IsNotEmpty()
  description!: string;
}