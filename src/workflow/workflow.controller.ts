import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post()
  create(@Body() createWorkflowDto: CreateWorkflowDto) {
    return this.workflowService.create(createWorkflowDto);
  }

  @Get('author/:authorId')
  findAll(@Param('authorId') authorId: number) {
    return this.workflowService.findAll(authorId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkflowDto: UpdateWorkflowDto) {
    return this.workflowService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.workflowService.remove(+id);
  }
}
