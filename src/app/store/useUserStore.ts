import { defineStore } from 'pinia';
import axiosWrapper from '@/app/http/axios-wrapper';

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    isAuthenticated: !!localStorage.getItem('accessToken')
  }),

  getters: {
    hasRole: (state) => (role: string) => state.user?.roles.includes(role)
  },

  actions: {
    // ------------------------------------
    // LOGIN
    // ------------------------------------
    async login(payload: LoginPayload) {
      const tokens = await axiosWrapper.post<AuthTokens>('/Users/login', payload, {}, false);

      this.setTokens(tokens as AuthTokens);
      await this.fetchUser();
    },

    // ------------------------------------
    // LOAD CURRENT USER
    // ------------------------------------
    async fetchUser() {
      const user = await axiosWrapper.get<User>('/Users/me');
      this.user = user as User;
    },

    // ------------------------------------
    // REFRESH TOKEN
    // ------------------------------------
    async refreshTokenAction(): Promise<boolean> {
      try {
        const tokens = await axiosWrapper.post<AuthTokens>('/Users/refresh', {
          refreshToken: this.refreshToken
        });

        this.setTokens(tokens as AuthTokens);
        return true;
      } catch {
        this.logout();
        return false;
      }
    },

    // ------------------------------------
    // SAVE TOKENS
    // ------------------------------------
    setTokens(tokens: AuthTokens) {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      this.isAuthenticated = true;

      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    },

    // ------------------------------------
    // LOGOUT
    // ------------------------------------
    logout() {
      this.user = null;
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});
