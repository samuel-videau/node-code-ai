import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { WorkflowModule } from './workflow/workflow.module';

@Module({
  imports: [DbModule, WorkflowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
