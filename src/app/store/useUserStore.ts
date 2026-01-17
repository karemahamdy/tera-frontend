import { defineStore } from "pinia";
import axiosWrapper from "@/app/http/axiosWrapper";
import i18n from "@/app/i18n/index";
import type {
  User,
  UserData,
  LoginPayload,
  Entity,
  AuthData,
  AuthDataResponse,
  UserGlobalProfile,
  SwitchBranch,
  ResetPassword,
} from "@/app/types/user";
import router from "@/app/router";

// ------------------------------------
// LANGUAGE HELPER
// ------------------------------------
let Lang = (): string => {
  let lang;
  if (localStorage.getItem("lang") === null) {
    let browserLanguage = window.navigator.language ?? "";
    if (browserLanguage) {
      browserLanguage = browserLanguage.substring(0, 2);
      lang = browserLanguage;
    } else {
      import.meta.env.VITE_DEFUALT_LANGUAGE === "en"
        ? document.documentElement.setAttribute("dir", "ltr")
        : document.documentElement.setAttribute("dir", "rtl");
      lang = import.meta.env.VITE_DEFUALT_LANGUAGE;
    }
  } else {
    lang = localStorage.getItem("lang");
  }
  if (lang == "en") {
    document.documentElement.setAttribute("lang", "en");
    document.documentElement.setAttribute("dir", "ltr");
  } else {
    document.documentElement.setAttribute("lang", "ar");
    document.documentElement.setAttribute("dir", "rtl");
  }
  localStorage.setItem("lang", lang);
  return lang;
};

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    accessToken:
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken") ||
      "",
    refreshToken:
      localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken") ||
      "",
    rememberMe: localStorage.getItem("rememberMe") === "true",
    isAuthenticated: !!(
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken")
    ),
    lang: Lang() as string,
    entities: [] as Entity[],
    userProfile: null as UserGlobalProfile | null,
    requiresPasswordReset:
      localStorage.getItem("requiresPasswordReset") === "true",
    getSessionErrorMsgFlag: true,
  }),

  getters: {
    hasRole: (state) => (role: string) => state.user?.roles.includes(role),
  },

  actions: {
    // ------------------------------------
    // SET LANGUAGE
    // ------------------------------------
    setLang(lang: string) {
      if (!lang) return;
      this.lang = lang;
      localStorage.setItem("lang", lang);
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute(
        "dir",
        lang === "en" ? "ltr" : "rtl"
      );

      try {
        // @ts-ignore
        i18n.global.locale.value = lang;
      } catch (e) {
        // ignore
      }
    },

    toggleLang() {
      this.setLang(this.lang === "en" ? "ar" : "en");
    },

    // ------------------------------------
    // LOGIN
    // ------------------------------------
    async login(payload: LoginPayload) {
      const response = await axiosWrapper.post<UserData>(
        "/Auth/login",
        payload,
        {}
      );
      const tokens = response.data as AuthData;
      this.requiresPasswordReset = response.data.requiresPasswordReset;
      localStorage.setItem(
        "rememberMe",
        String(response.data.requiresPasswordReset)
      );
      this.rememberMe = payload.rememberMe;
      localStorage.setItem("rememberMe", String(payload.rememberMe));
      this.getSessionErrorMsgFlag = true;
      this.setTokens(tokens);
      await this.fetchUserProfile();
    },

    // ------------------------------------
    // REFRESH TOKEN
    // ------------------------------------
    async refreshTokenAction(): Promise<boolean> {
      try {
        const tokens = await axiosWrapper.post<AuthDataResponse>(
          "/Auth/refresh-token",
          { refreshToken: this.refreshToken }
        );
        this.setTokens(tokens.data as AuthData);
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
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
      } else {
        sessionStorage.setItem("accessToken", tokens.accessToken);
        sessionStorage.setItem("refreshToken", tokens.refreshToken);
      }
    },

    setAccessToken(token: string) {
      this.accessToken = token;
      if (this.rememberMe) {
        localStorage.setItem("accessToken", token);
      } else {
        sessionStorage.setItem("accessToken", token);
      }
    },

    // ------------------------------------
    // LOGOUT
    // ------------------------------------
    logout() {
      this.closeSession();
      this.user = null;
      this.userProfile = null; // Clear profile
      this.accessToken = "";
      this.refreshToken = "";
      this.isAuthenticated = false;
      this.requiresPasswordReset = true;

      // Clear both storages
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("rememberMe");
      localStorage.removeItem("requiresPasswordReset");

      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");

      router.push({ name: "Login" });
    },

    resetSessionErrorMsgFlag(value = false) {
      this.getSessionErrorMsgFlag = value;
    },
    // ------------------------------------
    // SWITCH BRANCH
    // ------------------------------------
    async switchBranch(branchId: string) {
      try {
        const response = await axiosWrapper.post<SwitchBranch>(
          `/user-profile/switch-branch?BranchId=${branchId}`
        );
        // Update local state
        if (this.userProfile && this.userProfile.branches) {
          const newBranch = this.userProfile.branches.available.find(
            (b) => b.id === branchId
          );
          if (newBranch) {
            this.userProfile.branches.current = newBranch;
          }
        }
        this.setAccessToken(response.data.newToken);
      } catch (error) {
        console.error("Failed to switch branch:", error);
      }
    },

    // ------------------------------------
    // FETCH ENTITY LOOKUPS
    // ------------------------------------
    async fetchEntityLookups() {
      const data = await axiosWrapper.get<any>("/Lookups/EntityLookups");
      this.entities = data.data as Entity[];
    },

    // ------------------------------------
    // FETCH USER PROFILE
    // ------------------------------------
    async fetchUserProfile() {
      try {
        const response = await axiosWrapper.get<any>("/user-profile");
        this.userProfile = response.data;
        return this.userProfile;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },

    async resetUserPassword(values: ResetPassword) {
      await axiosWrapper.post<ResetPassword>("/Auth/reset-password", values);
    },

    closeSession() {
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = this.accessToken;
      const body = {
        token,
      };
      const blob = new Blob([JSON.stringify(body)], {
        type: "application/json",
      });
      navigator.sendBeacon(`${apiUrl}/Session/logout`, blob);
    },
  },
});
