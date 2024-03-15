import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLlmActionDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly model?: string;

  @IsString()
  @IsOptional()
  readonly assistant?: string;

  @IsString()
  @IsOptional()
  readonly system?: string;

  @IsString()
  @IsOptional()
  readonly user?: string;

  @IsNumber()
  @IsOptional()
  readonly frequencyPenalty?: number;

  @IsNumber()
  @IsOptional()
  readonly presencePenalty?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly maxTokens?: number;

  @IsNumber()
  @IsOptional()
  readonly n?: number;

  @IsNumber()
  @IsOptional()
  readonly seed?: number;

  @IsNumber()
  @IsOptional()
  readonly temperature?: number;

  @IsNumber()
  @IsOptional()
  readonly topP?: number;
}
