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
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorators';

export interface StaffJwtPayload {
  sub: string;
  role: Role;
  typ: 'staff';
}

/**
 * Globalny guard: każdy endpoint wymaga tokenu pracownika,
 * chyba że jest oznaczony @Public(). @Roles() dodatkowo zawęża dostęp.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [context.getHandler(), context.getClass()];

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    );
    if (isPublic) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: StaffJwtPayload }>();
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
    request.user = payload;

    const roles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      targets,
    );
    if (roles && !roles.includes(payload.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}
