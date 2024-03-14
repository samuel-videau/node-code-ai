import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDb } from './db/scripts/seed';

async function bootstrap() {
  await seedDb();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
