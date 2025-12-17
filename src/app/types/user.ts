export interface LoginPayload {
  userName: string;
  password: string;
  entityId?: string;
  rememberMe: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface UserData {
  id: string;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    requiresPasswordReset: boolean;
  };
}

export interface AuthData {
  accessToken: string;
  entityId: string;
  expiresAt: string;
  refreshToken: string;
  requiresPasswordReset: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Entity {
  id: string;
  name: string;
}
