import { Module } from '@nestjs/common';
import { InputService } from './input.service';
import { InputController } from './input.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [InputController],
  providers: [InputService],
})
export class InputModule {}
