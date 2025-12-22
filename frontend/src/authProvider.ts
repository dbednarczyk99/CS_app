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
          throw new Error(response.statusText);
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

  checkError: () => Promise.resolve(),
  getPermissions: () => Promise.resolve(),
};
