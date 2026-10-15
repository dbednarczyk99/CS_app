import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

// Endpoint dostępny bez logowania
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Endpoint dostępny tylko dla wskazanych ról pracowników
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Role, które mogą edytować treści strony (produkty, kontakt, bus itd.)
export const CONTENT_ROLES: Role[] = [Role.ADMIN, Role.EDITOR];

// Role, które mogą edytować blog i wgrywać zdjęcia
export const BLOG_ROLES: Role[] = [Role.ADMIN, Role.EDITOR, Role.BLOGGER];

// Role obsługujące rezerwacje w panelu
export const RESERVATION_ROLES: Role[] = [Role.ADMIN, Role.EDITOR];
