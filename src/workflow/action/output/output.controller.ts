import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OutputService } from './output.service';
import { CreateOutputDto } from './dto/create-output.dto';
import { UpdateOutputDto } from './dto/update-output.dto';

@Controller('workflow/:workflowId/action/:actionId/output')
export class OutputController {
  constructor(private readonly outputService: OutputService) {}

  @Post()
  create(@Body() createOutputDto: CreateOutputDto, @Param('actionId') actionId: number) {
    return this.outputService.create(actionId, createOutputDto);
  }

  @Get()
  findAll(@Param('actionId') actionId: number) {
    return this.outputService.findAll(actionId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOutputDto: UpdateOutputDto) {
    return this.outputService.update(+id, updateOutputDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.outputService.remove(+id);
  }
}
