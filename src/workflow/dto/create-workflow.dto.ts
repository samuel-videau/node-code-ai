import { IsBoolean, IsInt, IsNotEmpty, IsString, Min } from '@nestjs/class-validator';

export class CreateWorkflowDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  authorId: number;

  @IsInt()
  status: number;

  @IsBoolean()
  isPublic: boolean;
}
