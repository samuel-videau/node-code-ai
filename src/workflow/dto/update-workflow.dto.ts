import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateWorkflowDto } from './create-workflow.dto';
import { IsInt, IsOptional } from '@nestjs/class-validator';

class IntermediateUpdateWorkflowDto extends OmitType(CreateWorkflowDto, ['authorId'] as const) {}

export class UpdateWorkflowDto extends PartialType(CreateWorkflowDto) {
    @IsInt()
    @IsOptional()
    status: number;
}
