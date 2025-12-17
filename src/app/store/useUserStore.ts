import { defineStore } from 'pinia';
import axiosWrapper from '@/app/http/axiosWrapper';
import { i18n } from '@/plugins/i18n';
import type { User, UserData, LoginPayload, Entity, AuthData } from "@/app/types/user";
import router from "@/app/router";

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
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
    rememberMe: localStorage.getItem('rememberMe') || false,
    isAuthenticated: !!localStorage.getItem('accessToken'),
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
      if (lang === 'en') {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
      } else {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', 'rtl');
      }
      try {
        // update vue-i18n runtime locale
        // `i18n.global.locale` is a Ref when using Composition API mode
        // set to the new language
        // @ts-ignore
        i18n.global.locale.value = lang;
      } catch (e) {
        // ignore if i18n not available
      }
    },

    toggleLang() {
      const newLang = this.lang === 'en' ? 'ar' : 'en';
      this.setLang(newLang);
    },
    // ------------------------------------
    // LOGIN
    // ------------------------------------
    async login(payload: LoginPayload) {
      let data = {
        ...payload,
        "isAdminLogin": true
      }
      const response = await axiosWrapper.post<UserData>('/Auth/login', data, {}, false);
      const tokens = response.data as AuthData;
      this.rememberMe = payload.rememberMe
      this.setTokens(tokens);
      // await this.fetchUser(payload);
    },

    // ------------------------------------
    // LOAD CURRENT USER
    // ------------------------------------
    async fetchUser() {
      // const user = await axiosWrapper.get<User>('/Users/me');
      // this.user = user as User;

    },

    // ------------------------------------
    // REFRESH TOKEN
    // ------------------------------------
    async refreshTokenAction(): Promise<boolean> {
      try {
        const tokens = await axiosWrapper.post<AuthData>('/Auth/refresh-token', {
          refreshToken: this.refreshToken
        });

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
      if(this.rememberMe){
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
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

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      router.push({ name: "Login" });
    },
    
    async fetchEntityLookups() {
      const data = await axiosWrapper.get<any>('/EntityLookups');
      this.entities = data.data as Entity[];
    },

  }
});
