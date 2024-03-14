import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
import { ENV_VAR } from './types';

config();

@Injectable()
export class EnvService {
  getEnvOrThrow(envVar: ENV_VAR): string {
    const value = process.env[envVar];
    if (!value) {
      throw new Error(`Environment variable ${envVar} is not set`);
    }
    return value;
  }
}
