import * as dotenv from 'dotenv';
dotenv.config(); // đảm bảo .env nạp trước khi tạo App

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.setGlobalPrefix('api/v1', { exclude: [''] });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  const config = app.get(ConfigService);
  const port = config.get<string>('PORT') || '8080';
  console.log('[BOOT] PORT =', port);

  await app.listen(port, '0.0.0.0');
  console.log('[READY] http://localhost:' + port);
}
bootstrap();