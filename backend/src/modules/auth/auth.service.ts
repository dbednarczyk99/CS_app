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
// ochrona konta przed zgadywaniem z wielu adresów naraz: po 5 błędach rosnąca przerwa
// (30 s, 1, 2, 4, 8 min… maks. 15 min); reset hasła e-mailem zdejmuje blokadę
const ACCOUNT_FREE_ATTEMPTS = 5;
const ACCOUNT_BASE_DELAY_MS = 30 * 1000;
const ACCOUNT_MAX_DELAY_MS = 15 * 60 * 1000;
// porównanie z tym hashem, gdy konta nie ma – odpowiedź trwa tyle samo (nie zdradza, czy login istnieje)
const DUMMY_HASH = bcrypt.hashSync('brak-takiego-konta', 10);

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
  private readonly accountFailures = new Map<
    string,
    { count: number; last: number }
  >();

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

    const login = data.login.trim().toLowerCase();
    const wait = this.accountWait(login, now);
    if (wait > 0) {
      throw new HttpException(
        `Zbyt wiele nieudanych prób logowania na to konto – spróbuj za ${Math.ceil(wait / 60000)} min albo użyj „Nie pamiętam hasła”`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { login } });
    const ok = await bcrypt.compare(
      data.password,
      user?.password ?? DUMMY_HASH,
    );
    if (!user || !ok) {
      this.failed.push({ ip, at: now });
      const entry = this.accountFailures.get(login);
      this.accountFailures.set(login, {
        count: (entry?.count ?? 0) + 1,
        last: now,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.accountFailures.delete(login);
    return { access_token: this.token(user) };
  }

  /** Ile jeszcze trzeba poczekać z kolejną próbą na to konto (0 – można próbować) */
  private accountWait(login: string, now: number) {
    const entry = this.accountFailures.get(login);
    if (!entry) return 0;
    if (now - entry.last > 2 * ACCOUNT_MAX_DELAY_MS) {
      this.accountFailures.delete(login);
      return 0;
    }
    if (entry.count < ACCOUNT_FREE_ATTEMPTS) return 0;
    const delay = Math.min(
      ACCOUNT_BASE_DELAY_MS * 2 ** (entry.count - ACCOUNT_FREE_ATTEMPTS),
      ACCOUNT_MAX_DELAY_MS,
    );
    return Math.max(0, entry.last + delay - now);
  }

  /** Po ustawieniu nowego hasła (reset e-mailem) – zdjęcie blokady konta */
  clearAccountFailures(login: string) {
    this.accountFailures.delete(login.toLowerCase());
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
