import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { LoggerModule } from 'src/logger/logger.module';
import { EnvModule } from 'src/env/env.module';

@Module({
  imports: [LoggerModule, EnvModule],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
