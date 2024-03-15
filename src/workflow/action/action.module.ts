import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { DbModule } from 'src/db/db.module';
import { InputModule } from './input/input.module';

@Module({
  imports: [DbModule, InputModule],
  controllers: [ActionController],
  providers: [ActionService],
})
export class ActionModule {}
