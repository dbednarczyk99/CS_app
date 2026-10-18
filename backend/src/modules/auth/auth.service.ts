import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/user.dto';
import type { StaffJwtPayload } from './auth.guard';

// ochrona przed zgadywaniem haseł: nieudane logowania z jednego adresu IP w oknie 15 min
const FAILED_LIMIT = 10;
const WINDOW_MS = 15 * 60 * 1000;

export const hashPassword = (password: string) => bcrypt.hash(password, 10);

/** Dane konta bez hasła – do panelu */
export const publicUser = {
  id: true,
  login: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

@Injectable()
export class AuthService {
  private readonly failed: { ip: string; at: number }[] = [];

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private token(user: Pick<User, 'id' | 'role' | 'tokenVersion'>) {
    const payload: StaffJwtPayload = {
      sub: user.id,
      role: user.role,
      typ: 'staff',
      tv: user.tokenVersion,
    };
    return this.jwtService.sign(payload);
  }

  async login(data: LoginDto, ip: string) {
    const now = Date.now();
    while (this.failed.length && now - this.failed[0].at > WINDOW_MS)
      this.failed.shift();
    if (this.failed.filter((f) => f.ip === ip).length >= FAILED_LIMIT) {
      throw new HttpException(
        'Zbyt wiele nieudanych prób logowania – spróbuj ponownie za 15 minut',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { login: data.login.trim().toLowerCase() },
    });
    const ok = !!user && (await bcrypt.compare(data.password, user.password));
    if (!user || !ok) {
      this.failed.push({ ip, at: now });
      throw new UnauthorizedException('Invalid credentials');
    }

    return { access_token: this.token(user) };
  }

  me(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: publicUser,
    });
  }

  /** Zmiana własnego hasła; inne sesje tego konta wygasają, bieżąca dostaje nowy token */
  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new BadRequestException('Obecne hasło jest nieprawidłowe');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('Nowe hasło musi być inne niż obecne');
    }
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: await hashPassword(dto.newPassword),
        tokenVersion: { increment: 1 },
      },
    });
    return { access_token: this.token(updated) };
  }
}
