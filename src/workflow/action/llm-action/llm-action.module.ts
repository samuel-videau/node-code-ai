import { Module } from '@nestjs/common';
import { LlmActionService } from './llm-action.service';
import { LlmActionController } from './llm-action.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [LlmActionController],
  providers: [LlmActionService],
})
export class LlmActionModule {}
