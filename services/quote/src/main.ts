import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runMigrations } from './boostrap.migrations';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await runMigrations();
  await app.listen(process.env.PORT);
}
bootstrap();
