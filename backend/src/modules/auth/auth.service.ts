import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/user.dto';
import type { StaffJwtPayload } from './auth.guard';
import { passwordChangedEmail, passwordResetEmail } from './password-emails';

// „Nie pamiętam hasła”: link ważny 30 min; prośby z jednego adresu IP i o jedno konto są ograniczone
const RESET_VALID_MIN = 30;
const RESET_PER_IP_LIMIT = 5; // w oknie 15 min
const RESET_RESEND_MS = 2 * 60 * 1000; // kolejny e-mail na to samo konto najwcześniej po 2 min
const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex');

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
  email: true,
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

  private readonly resetRequests: { ip: string; at: number }[] = [];

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mail: MailService,
    private config: ConfigService,
  ) {}

  /**
   * „Nie pamiętam hasła”: jeśli konto (login albo e-mail) ma adres e-mail, wysyła jednorazowy link.
   * Odpowiedź zawsze ta sama – nie zdradza, czy konto istnieje ani jaki ma adres.
   */
  async forgotPassword(dto: ForgotPasswordDto, ip: string) {
    const now = Date.now();
    while (
      this.resetRequests.length &&
      now - this.resetRequests[0].at > WINDOW_MS
    )
      this.resetRequests.shift();
    if (
      this.resetRequests.filter((r) => r.ip === ip).length >= RESET_PER_IP_LIMIT
    ) {
      throw new HttpException(
        'Zbyt wiele prób – spróbuj ponownie za 15 minut',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    this.resetRequests.push({ ip, at: now });

    const value = dto.login.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ login: value }, { email: value }] },
    });
    // brak konta, brak adresu albo link wysłany przed chwilą – nic nie robimy (ta sama odpowiedź)
    const recentlySent =
      user?.resetTokenExpires &&
      user.resetTokenExpires.getTime() - RESET_VALID_MIN * 60000 >
        now - RESET_RESEND_MS;
    if (user?.email && !recentlySent) {
      const token = randomBytes(32).toString('hex');
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetTokenHash: sha256(token),
          resetTokenExpires: new Date(now + RESET_VALID_MIN * 60000),
        },
      });
      const adminUrl = (
        this.config.get<string>('ADMIN_URL') ?? 'http://localhost:5173'
      ).replace(/\/$/, '');
      // token w części po „#” – nie trafia do logów serwera panelu
      const link = `${adminUrl}/#/nowe-haslo?token=${token}`;
      this.mail.sendAccount(
        passwordResetEmail(
          user.email,
          user.login,
          link,
          RESET_VALID_MIN,
          this.webUrl(),
        ),
      );
    }
    return { ok: true };
  }

  /** Nowe hasło z linku: jednorazowe, wylogowuje wszystkie sesje i zdejmuje blokadę logowania */
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { resetTokenHash: sha256(dto.token) },
    });
    if (
      !user ||
      !user.resetTokenExpires ||
      user.resetTokenExpires < new Date()
    ) {
      throw new BadRequestException(
        'Link wygasł albo został już użyty – poproś o nowy',
      );
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: await hashPassword(dto.password),
        tokenVersion: { increment: 1 },
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });
    this.clearAccountFailures(user.login);
    if (user.email) {
      this.mail.sendAccount(
        passwordChangedEmail(user.email, user.login, this.webUrl()),
      );
    }
    return { ok: true, login: user.login };
  }

  private webUrl() {
    return this.config.get<string>('WEB_URL') ?? 'http://localhost:3001';
  }

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
        // wcześniej wysłany link „Nie pamiętam hasła” przestaje działać
        resetTokenHash: null,
        resetTokenExpires: null,
      },
    });
    return { access_token: this.token(updated) };
  }
}
