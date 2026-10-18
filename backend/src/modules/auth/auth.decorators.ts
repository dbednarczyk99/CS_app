import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

// Endpoint dostępny bez logowania
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Endpoint dostępny tylko dla wskazanych ról pracowników
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

/*
 * Role w panelu: ADMIN = właściciel (wszystko), EDITOR = treści strony (menadżerka social mediów).
 * BLOGGER i VIEWER zostają w bazie dla zgodności, panel ich nie proponuje.
 */

// Role, które mogą edytować treści strony (produkty, piekarnie, chlebowóz, baner itd.)
export const CONTENT_ROLES: Role[] = [Role.ADMIN, Role.EDITOR];

// Role, które mogą edytować blog i wgrywać zdjęcia
export const BLOG_ROLES: Role[] = [Role.ADMIN, Role.EDITOR, Role.BLOGGER];

// Dane klientów (rezerwacje, lista subskrybentów) i konta – tylko właściciel (RODO: minimalny dostęp)
export const OWNER_ROLES: Role[] = [Role.ADMIN];
export const RESERVATION_ROLES: Role[] = OWNER_ROLES;
