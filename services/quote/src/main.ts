import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runMigrations } from './boostrap.migrations';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await runMigrations();
  await app.listen(process.env.PORT);
}
bootstrap();
