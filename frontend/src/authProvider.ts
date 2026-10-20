import type { AuthProvider } from 'react-admin';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authProvider: AuthProvider = {
  login: ({ username, password }) => {
    const request = new Request(`${apiUrl}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ login: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(
            response.status === 401 || response.status === 400
              ? 'Nieprawidłowy login lub hasło'
              : response.status === 429
                ? 'Zbyt wiele nieudanych prób logowania – spróbuj ponownie za 15 minut'
                : 'Nie udało się połączyć z serwerem – spróbuj ponownie za chwilę',
          );
        }
        return response.json();
      })
      .then(({ access_token }) => {
        localStorage.setItem('token', access_token);
      });
  },

  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject();
  },

  // 401: token wygasł, hasło zmieniono albo konto usunięto – wyloguj (403 = brak uprawnień, bez wylogowania)
  checkError: (error) => {
    if (error?.status === 401) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // rola z tokenu: 'ADMIN' (administrator) albo 'EDITOR' (marketing); serwer i tak sprawdza uprawnienia sam
  getPermissions: () => Promise.resolve(tokenRole()),

  // nazwa w prawym górnym rogu
  getIdentity: async () => {
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token') ?? ''}` },
    });
    if (!res.ok) throw new Error('Nie udało się pobrać danych konta');
    const me = (await res.json()) as { id: string; login: string; name: string | null };
    return { id: me.id, fullName: me.name || me.login };
  },
};

export type PanelRole = 'ADMIN' | 'EDITOR';

/** Rola zapisana w tokenie JWT (część środkowa, base64url) */
function tokenRole(): PanelRole | undefined {
  const token = localStorage.getItem('token');
  if (!token) return undefined;
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return (JSON.parse(atob(payload)) as { role?: PanelRole }).role;
  } catch {
    return undefined;
  }
}
