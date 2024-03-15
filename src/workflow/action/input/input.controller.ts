import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InputService } from './input.service';
import { CreateActionInputDto } from './dto/create-input.dto';
import { UpdateActionInputDto } from './dto/update-input.dto';

@Controller('workflow/:workflowId/action/:actionId/input')
export class InputController {
  constructor(private readonly inputService: InputService) {}

  @Post()
  create(@Body() createInputDto: CreateActionInputDto, @Param('actionId') actionId: number) {
    return this.inputService.create(actionId, createInputDto);
  }

  @Get()
  findAll(@Param('actionId') actionId: number) {
    return this.inputService.findAll(actionId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInputDto: UpdateActionInputDto) {
    return this.inputService.update(+id, updateInputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inputService.remove(+id);
  }
}
