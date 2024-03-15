import { PartialType } from '@nestjs/mapped-types';
import { CreateActionDto } from './create-action.dto';

// Now, make all properties of the intermediate type optional
export class UpdateActionDto extends PartialType(CreateActionDto) {}
