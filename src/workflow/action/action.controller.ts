import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('workflow/:workflowId/action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(@Param('workflowId') workflowId: number, @Body() createActionDto: CreateActionDto) {
    return this.actionService.create(workflowId, createActionDto);
  }

  @Get()
  findAll(@Param('workflowId') workflowId: number) {
    return this.actionService.findAll(workflowId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.actionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateActionDto: UpdateActionDto) {
    return this.actionService.update(+id, updateActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.actionService.remove(+id);
  }
}
