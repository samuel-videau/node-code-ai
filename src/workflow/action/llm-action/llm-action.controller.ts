import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LlmActionService } from './llm-action.service';
import { UpdateLlmActionDto } from './dto/update-llm-action.dto';

@Controller('workflow/:workflowId/action/:actionId/llm')
export class LlmActionController {
  constructor(private readonly llmActionService: LlmActionService) {}

  @Patch()
  update(@Param('actionId') actionId: number, @Body() updateLlmActionDto: UpdateLlmActionDto) {
    return this.llmActionService.update(actionId, updateLlmActionDto);
  }
}
