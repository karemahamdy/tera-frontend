import { defineStore } from 'pinia';
import axiosWrapper from '@/app/http/axiosWrapper';
import i18n from '@/plugins/i18n';
import type { User, UserData, LoginPayload, Entity, AuthData } from "@/app/types/user";
import router from "@/app/router";

// ------------------------------------
// LANGUAGE HELPER
// ------------------------------------
let Lang = (): string => {
  let lang;
  if (localStorage.getItem('lang') === null) {
    let browserLanguage = window.navigator.language ?? '';
    if (browserLanguage) {
      browserLanguage = browserLanguage.substring(0, 2);
      lang = browserLanguage;
    } else {
      import.meta.env.VITE_DEFUALT_LANGUAGE === 'en'
        ? document.documentElement.setAttribute('dir', 'ltr')
        : document.documentElement.setAttribute('dir', 'rtl');
      lang = import.meta.env.VITE_DEFUALT_LANGUAGE;
    }
  } else {
    lang = localStorage.getItem('lang');
  }
  if (lang == 'en') {
    document.documentElement.setAttribute('lang', 'en');
    document.documentElement.setAttribute('dir', 'ltr');
  } else {
    document.documentElement.setAttribute('lang', 'ar');
    document.documentElement.setAttribute('dir', 'rtl');
  }
  localStorage.setItem('lang', lang);
  return lang;
};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    accessToken: localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken') || '',
    rememberMe: localStorage.getItem("rememberMe") === "true",
    isAuthenticated: !!(localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')),
    lang: Lang() as string,
    entities: [] as Entity[]
  }),

  getters: {
    hasRole: (state) => (role: string) => state.user?.roles.includes(role)
  },

  actions: {
    // ------------------------------------
    // SET LANGUAGE
    // ------------------------------------
    setLang(lang: string) {
      if (!lang) return;
      this.lang = lang;
      localStorage.setItem('lang', lang);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');

      try {
        // @ts-ignore
        i18n.global.locale.value = lang;
      } catch (e) {
        // ignore
      }
    },

    toggleLang() {
      this.setLang(this.lang === 'en' ? 'ar' : 'en');
    },

    // ------------------------------------
    // LOGIN
    // ------------------------------------
    async login(payload: LoginPayload) {
      const response = await axiosWrapper.post<UserData>('/Auth/login', payload, {});
      const tokens = response.data as AuthData;

      this.rememberMe = payload.rememberMe;
      localStorage.setItem("rememberMe", String(payload.rememberMe));

      this.setTokens(tokens);
      // optionally fetch user here
      // await this.fetchUser();
    },

    // ------------------------------------
    // REFRESH TOKEN
    // ------------------------------------
    async refreshTokenAction(): Promise<boolean> {
      try {
        const tokens = await axiosWrapper.post<AuthData>('/Auth/refresh-token', { refreshToken: this.refreshToken });
        this.setTokens(tokens as AuthData);
        return true;
      } catch {
        this.logout();
        return false;
      }
    },

    // ------------------------------------
    // SAVE TOKENS
    // ------------------------------------
    setTokens(tokens: AuthData) {
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      this.isAuthenticated = true;

      if (this.rememberMe) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', tokens.accessToken);
        sessionStorage.setItem('refreshToken', tokens.refreshToken);
      }
    },

    // ------------------------------------
    // LOGOUT
    // ------------------------------------
    logout() {
      this.user = null;
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;

      // Clear both storages
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('rememberMe');

      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');

      router.push({ name: "Login" });
    },

    // ------------------------------------
    // FETCH ENTITY LOOKUPS
    // ------------------------------------
    async fetchEntityLookups() {
      const data = await axiosWrapper.get<any>('/Lookups/EntityLookups');
      this.entities = data.data as Entity[];
    },
  }
});
