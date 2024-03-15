import { PartialType } from '@nestjs/mapped-types';
import { CreateActionInputDto } from './create-input.dto';

export class UpdateActionInputDto extends PartialType(CreateActionInputDto) {}
