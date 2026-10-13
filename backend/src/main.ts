import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // CORS_ORIGINS: lista adresów rozdzielonych przecinkami
  const corsOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:5173,http://localhost:3001'
  )
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // whitelist: pola spoza DTO są usuwane z body
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    next();
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Backend running on http://localhost:${port}`);
  logger.log(`🌐 Allowed CORS origins: ${corsOrigins.join(', ')}`);
  logger.log(`🧩 Connected to database: ${process.env.DATABASE_URL}`);
}

void bootstrap();
