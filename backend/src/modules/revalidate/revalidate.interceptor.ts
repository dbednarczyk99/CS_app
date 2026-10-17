import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, tap } from 'rxjs';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Po każdej udanej zmianie zrobionej z panelu (zalogowany użytkownik, POST/PATCH/PUT/DELETE)
 * prosi stronę Next.js o odświeżenie cache – zmiany widać od razu, bez czekania na ISR (60 s).
 * Kilka zapisów pod rząd (np. upload zdjęcia + zapis formularza) daje jedno odświeżenie.
 */
@Injectable()
export class RevalidateInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RevalidateInterceptor.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; user?: unknown }>();
    if (READ_METHODS.has(request.method) || !request.user) return next.handle();
    return next.handle().pipe(tap(() => this.schedule()));
  }

  private schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.revalidate();
    }, 500);
  }

  private async revalidate() {
    const secret = this.config.get<string>('REVALIDATE_SECRET');
    if (!secret) return;
    const webUrl = this.config.get<string>('WEB_URL') ?? 'http://localhost:3001';
    try {
      const res = await fetch(`${webUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
      });
      if (!res.ok) this.logger.warn(`Odświeżenie strony nie powiodło się: ${res.status}`);
    } catch (error) {
      this.logger.warn(`Strona niedostępna przy odświeżaniu: ${(error as Error).message}`);
    }
  }
}
