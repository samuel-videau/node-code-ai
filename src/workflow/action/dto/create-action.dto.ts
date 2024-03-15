import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateActionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  order: number;

  @IsInt()
  specificActionType: string;
}
