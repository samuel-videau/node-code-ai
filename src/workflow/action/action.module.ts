import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { DbModule } from 'src/db/db.module';
import { InputModule } from './input/input.module';
import { OutputModule } from './output/output.module';

@Module({
  imports: [DbModule, InputModule, OutputModule],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
