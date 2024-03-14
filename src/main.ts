import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDb } from './db/scripts/seed';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  await seedDb();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
