import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Historia wersji treści i ustawień (ContentRevision): przed każdą zmianą zapisujemy poprzednią wartość
 * z nazwą osoby, która ją zastąpiła. Klucz: sekcja strony, `hero:<id>`, `settings.reservations`, `legal.<dokument>`.
 */
export async function addRevision(
  prisma: PrismaService,
  key: string,
  data: unknown,
  userId?: string,
) {
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, login: true },
      })
    : null;
  await prisma.contentRevision.create({
    data: {
      key,
      data: data as Prisma.InputJsonValue,
      createdBy: user?.name || user?.login || null,
    },
  });
}

/** Najnowsze wersje (od ostatniej) */
export function listRevisions(
  prisma: PrismaService,
  key: string,
  take: number,
) {
  return prisma.contentRevision.findMany({
    where: { key },
    orderBy: { createdAt: 'desc' },
    take,
    select: { id: true, data: true, createdBy: true, createdAt: true },
  });
}
