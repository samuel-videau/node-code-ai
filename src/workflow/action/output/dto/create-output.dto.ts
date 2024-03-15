import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOutputDto {
  @IsNumber()
  readonly actionId: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly type: string;
}
