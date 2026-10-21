import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { timingSafeEqual } from 'crypto';
import type { Request } from 'express';

const secret = process.env.INTERNAL_API_SECRET ?? '';
const production = process.env.NODE_ENV === 'production';
if (!secret && production) {
  new Logger('ClientIp').warn(
    'INTERNAL_API_SECRET nie jest ustawiony – adres klienta z serwera strony jest ignorowany (limity liczą się wspólnie)',
  );
}

const matches = (given: string) => {
  const a = Buffer.from(given);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
};

/**
 * Adres IP klienta do limitów (formularze, statystyki, logowanie).
 * Formularze idą przez serwer strony, który podaje adres odwiedzającego w X-Client-IP – ufamy mu tylko
 * z poprawnym X-Internal-Secret (bez sekretu każdy mógłby podać dowolny adres i obejść limity).
 * W trybie deweloperskim bez ustawionego sekretu nagłówek jest przyjmowany.
 */
export function clientIp(req: Request): string {
  const claimed = req.header('x-client-ip')?.trim();
  const given = req.header('x-internal-secret') ?? '';
  const trusted = secret ? matches(given) : !production;
  return (trusted && claimed) || req.ip || req.socket.remoteAddress || '';
}

/** @ClientIp() – adres klienta (patrz clientIp) */
export const ClientIp = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) =>
    clientIp(ctx.switchToHttp().getRequest<Request>()),
);
