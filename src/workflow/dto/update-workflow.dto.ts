import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowDto } from './create-workflow.dto';

class IntermediateUpdateWorkflowDto extends OmitType(CreateWorkflowDto, ['authorId'] as const) {}

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {}
