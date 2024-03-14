import { Module } from '@nestjs/common';
import { EnvService } from './env.service';

@Module({
  imports: [],
  providers: [EnvService],
})
export class EnvModule {}
