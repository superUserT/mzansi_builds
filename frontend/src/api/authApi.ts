import { fetchClient } from './fetchClient';

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    return fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { email: string; password: string; username: string }) => {
    return fetchClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
};