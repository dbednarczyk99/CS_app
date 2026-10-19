import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorators';

export interface StaffJwtPayload {
  sub: string;
  role: Role;
  typ: 'staff';
  /** wersja hasła z chwili logowania – po zmianie hasła starsze tokeny są odrzucane */
  tv: number;
}

export type StaffRequest = Request & { user?: StaffJwtPayload };

/**
 * Globalny guard: każdy endpoint wymaga tokenu pracownika,
 * chyba że jest oznaczony @Public(). @Roles() dodatkowo zawęża dostęp.
 * Konto jest sprawdzane w bazie przy każdym żądaniu – usunięcie konta, zmiana roli
 * czy hasła działają od razu, bez czekania na wygaśnięcie tokenu.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<StaffRequest>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    let payload: StaffJwtPayload;
    try {
      payload = this.jwtService.verify<StaffJwtPayload>(token);
    } catch {
      throw new UnauthorizedException();
    }
    if (payload.typ !== 'staff') {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { role: true, tokenVersion: true },
    });
    if (!user || user.tokenVersion !== (payload.tv ?? 0)) {
      throw new UnauthorizedException();
    }
    // rola zawsze aktualna z bazy
    request.user = { ...payload, role: user.role };

    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      targets,
    );
    if (roles && !roles.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
