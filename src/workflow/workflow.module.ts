import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { WorkflowController } from './workflow.controller';
import { DbModule } from '../db/db.module';
import { ActionModule } from './action/action.module';

@Module({
  imports: [DbModule, ActionModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
})
export class WorkflowModule {}
