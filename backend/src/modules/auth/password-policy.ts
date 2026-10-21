import { ValidateBy, type ValidationOptions } from 'class-validator';

/*
 * Wymagania dla nowych haseł do panelu (te same reguły w panelu: frontend/src/admin/common/password-rules.ts).
 * Dotyczą ustawiania hasła – stare hasła działają do pierwszej zmiany.
 */
export const PASSWORD_MIN = 10;

const RULES: { test: (password: string) => boolean; label: string }[] = [
  {
    test: (p) => p.length >= PASSWORD_MIN,
    label: `co najmniej ${PASSWORD_MIN} znaków`,
  },
  { test: (p) => /\p{Ll}/u.test(p), label: 'małą literę' },
  { test: (p) => /\p{Lu}/u.test(p), label: 'wielką literę' },
  { test: (p) => /\d/.test(p), label: 'cyfrę' },
  {
    test: (p) => /[^\p{L}\p{N}\s]/u.test(p),
    label: 'znak specjalny (np. ! ? # %)',
  },
];

/** Czego brakuje w haśle (pusta lista – hasło spełnia wymagania) */
export const passwordProblems = (password: string) =>
  RULES.filter((rule) => !rule.test(password)).map((rule) => rule.label);

/** Walidacja pola z nowym hasłem w DTO */
export function StrongPassword(options?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: 'strongPassword',
      validator: {
        validate: (value: unknown) =>
          typeof value === 'string' && passwordProblems(value).length === 0,
        defaultMessage: (args) =>
          `Hasło musi zawierać: ${passwordProblems(String(args?.value ?? '')).join(', ')}`,
      },
    },
    options,
  );
}
