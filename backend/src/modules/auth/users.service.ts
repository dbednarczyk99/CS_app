import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { hashPassword, publicUser } from './auth.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

/** Konta panelu – zarządza nimi tylko właściciel (rola ADMIN) */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: publicUser,
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: publicUser,
    });
    if (!user) throw new NotFoundException('Nie ma takiego konta');
    return user;
  }

  async create(dto: CreateUserDto) {
    const login = dto.login.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { login } })) {
      throw new ConflictException('Konto o tym loginie już istnieje');
    }
    return this.prisma.user.create({
      select: publicUser,
      data: {
        login,
        name: dto.name?.trim() || null,
        role: dto.role,
        password: await hashPassword(dto.password),
      },
    });
  }

  async update(id: string, dto: UpdateUserDto, currentUserId: string) {
    const user = await this.findOne(id);
    if (dto.role && dto.role !== user.role && id === currentUserId) {
      throw new BadRequestException('Nie możesz zmienić roli własnego konta');
    }
    if (dto.role && dto.role !== Role.ADMIN && user.role === Role.ADMIN) {
      await this.ensureAnotherAdmin(id);
    }
    return this.prisma.user.update({
      where: { id },
      select: publicUser,
      data: {
        name: dto.name === undefined ? undefined : dto.name?.trim() || null,
        role: dto.role,
        // nowe hasło ustawione przez właściciela – sesje tego konta wygasają
        ...(dto.password
          ? {
              password: await hashPassword(dto.password),
              tokenVersion: { increment: 1 },
            }
          : {}),
      },
    });
  }

  async remove(id: string, currentUserId: string) {
    const user = await this.findOne(id);
    if (id === currentUserId) {
      throw new BadRequestException('Nie możesz usunąć własnego konta');
    }
    if (user.role === Role.ADMIN) await this.ensureAnotherAdmin(id);
    await this.prisma.user.delete({ where: { id } });
    return user;
  }

  /** Zawsze musi zostać co najmniej jedno konto właściciela */
  private async ensureAnotherAdmin(exceptId: string) {
    const admins = await this.prisma.user.count({
      where: { role: Role.ADMIN, id: { not: exceptId } },
    });
    if (admins === 0) {
      throw new BadRequestException(
        'Musi zostać co najmniej jedno konto właściciela',
      );
    }
  }
}
