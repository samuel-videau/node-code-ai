import { Module } from '@nestjs/common';
import { OutputService } from './output.service';
import { OutputController } from './output.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [OutputController],
  providers: [OutputService],
})
export class OutputModule {}
