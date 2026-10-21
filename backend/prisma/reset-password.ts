/*
 * Awaryjny reset hasła do panelu – uruchamia osoba z dostępem do serwera:
 *
 *   npm run haslo -- <login>                  → nowe losowe hasło (wypisane w konsoli)
 *   npm run haslo -- <login> "<nowe hasło>"   → wskazane hasło (min. 10 znaków, mała i wielka litera, cyfra, znak specjalny)
 *
 * Gdy konta nie ma, zakłada je jako konto właściciela (ADMIN). Dotychczasowe sesje konta wygasają.
 */
import 'dotenv/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { passwordProblems } from '../src/modules/auth/password-policy';

const prisma = new PrismaClient();

/** Losowe hasło spełniające wymagania: bez znaków łatwych do pomylenia (0/O, 1/l/I), z cyfrą i znakiem specjalnym */
function randomPassword(): string {
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (;;) {
    const core = Array.from(randomBytes(13), (b) => alphabet[b % alphabet.length]).join('');
    const candidate = `${core.slice(0, 7)}-${core.slice(7)}!`;
    if (passwordProblems(candidate).length === 0) return candidate;
  }
}

async function main() {
  const [loginArg, passwordArg] = process.argv.slice(2);
  if (!loginArg) {
    console.error('Użycie: npm run haslo -- <login> ["<nowe hasło>"]');
    process.exit(1);
  }
  const login = loginArg.trim().toLowerCase();
  const password = passwordArg ?? randomPassword();
  const problems = passwordProblems(password);
  if (problems.length) {
    console.error(`Hasło musi zawierać: ${problems.join(', ')}.`);
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { login } });
  if (existing) {
    await prisma.user.update({
      where: { login },
      data: { password: hash, tokenVersion: { increment: 1 } },
    });
    console.log(`Zmieniono hasło konta „${login}” (rola: ${existing.role}). Dotychczasowe sesje wygasły.`);
  } else {
    await prisma.user.create({ data: { login, password: hash, role: Role.ADMIN, name: 'Właściciel' } });
    console.log(`Nie było konta „${login}” – założono nowe konto właściciela.`);
  }
  if (!passwordArg) console.log(`Nowe hasło: ${password}`);
  console.log('Po zalogowaniu warto ustawić własne hasło w „Moje konto”.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
