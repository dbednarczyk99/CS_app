/*
 * Awaryjny reset hasła do panelu – uruchamia osoba z dostępem do serwera:
 *
 *   npm run haslo -- <login>                  → nowe losowe hasło (wypisane w konsoli)
 *   npm run haslo -- <login> "<nowe hasło>"   → wskazane hasło (min. 10 znaków)
 *
 * Gdy konta nie ma, zakłada je jako konto właściciela (ADMIN). Dotychczasowe sesje konta wygasają.
 */
import 'dotenv/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const [loginArg, passwordArg] = process.argv.slice(2);
  if (!loginArg) {
    console.error('Użycie: npm run haslo -- <login> ["<nowe hasło>"]');
    process.exit(1);
  }
  const login = loginArg.trim().toLowerCase();
  // bez znaków łatwych do pomylenia (0/O, 1/l/I)
  const alphabet = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const password =
    passwordArg ?? Array.from(randomBytes(14), (b) => alphabet[b % alphabet.length]).join('');
  if (password.length < 10) {
    console.error('Hasło musi mieć co najmniej 10 znaków.');
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
