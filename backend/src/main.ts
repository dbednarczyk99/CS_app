import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // produkcja bez mocnego sekretu tokenów = każdy mógłby podrobić logowanie – serwer nie startuje
  if (
    process.env.NODE_ENV === 'production' &&
    (process.env.JWT_SECRET ?? '').length < 32
  ) {
    throw new Error(
      'JWT_SECRET musi być ustawiony (min. 32 znaki) – np. `openssl rand -hex 32`',
    );
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // za serwerem pośredniczącym (nginx): adres klienta z nagłówka dodanego przez ten serwer, np. TRUST_PROXY=1
  if (process.env.TRUST_PROXY) {
    const value = process.env.TRUST_PROXY;
    app.set('trust proxy', /^\d+$/.test(value) ? Number(value) : value);
  }
  app.disable('x-powered-by');

  // nagłówki ochronne; API zwraca tylko JSON i zdjęcia – nic tu nie może być osadzane ani uruchamiane
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: false,
        directives: { defaultSrc: ["'none'"], frameAncestors: ["'none'"] },
      },
      // zdjęcia z /uploads wyświetla strona, panel i programy pocztowe (inne domeny)
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

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
    // tokeny z linków (anulowanie rezerwacji, reset hasła) nie trafiają do logów
    logger.log(
      `${req.method} ${req.url.replace(/[A-Za-z0-9_-]{32,}/g, '***')}`,
    );
    next();
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Backend running on http://localhost:${port}`);
  logger.log(`🌐 Allowed CORS origins: ${corsOrigins.join(', ')}`);
  // bez hasła – logi mogą trafić w niepowołane ręce
  logger.log(
    `🧩 Database: ${(process.env.DATABASE_URL ?? '').replace(/\/\/[^@]*@/, '//***@')}`,
  );
}

void bootstrap();
