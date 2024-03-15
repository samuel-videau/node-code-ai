import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateActionInputDto {
  @IsNumber()
  @IsOptional()
  readonly valueFromOutputId?: number | null;

  @IsString()
  readonly name: string;

  @IsString()
  readonly type: string;
}