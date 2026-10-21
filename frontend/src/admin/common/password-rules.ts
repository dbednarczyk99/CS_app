/*
 * Wymagania dla nowych haseł – te same reguły sprawdza serwer (backend/src/modules/auth/password-policy.ts).
 */
export const PASSWORD_MIN = 10;

export const PASSWORD_RULES: { test: (password: string) => boolean; label: string }[] = [
  { test: (p) => p.length >= PASSWORD_MIN, label: `co najmniej ${PASSWORD_MIN} znaków` },
  { test: (p) => /\p{Ll}/u.test(p), label: 'mała litera' },
  { test: (p) => /\p{Lu}/u.test(p), label: 'wielka litera' },
  { test: (p) => /\d/.test(p), label: 'cyfra' },
  { test: (p) => /[^\p{L}\p{N}\s]/u.test(p), label: 'znak specjalny (np. ! ? # %)' },
];

export const isStrongPassword = (password: string) => PASSWORD_RULES.every((rule) => rule.test(password));

/** Walidator react-admina: puste pole przepuszcza (wymagalność ustawia `required()`) */
export const strongPassword = (value: unknown) =>
  !value || isStrongPassword(String(value))
    ? undefined
    : `Hasło musi zawierać: ${PASSWORD_RULES.filter((r) => !r.test(String(value)))
        .map((r) => r.label)
        .join(', ')}`;
