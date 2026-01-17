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

export interface AuthDataResponse {
  data: AuthData;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Entity {
  id: string;
  name: string;
}

export interface Branch {
  id: string;
  nameEn: string;
  nameAr: string;
  code: string;
}

export interface UserProfileData {
  id: string;
  fullName: string;
  email: string;
  userName: string;
  internalID: string;
  profileImageUrl: string | null;
  isActive: boolean;
  isFirstLogin: boolean;
  isAdmin: boolean;
  groupId: string | null;
  departmentId: string | null;
  lastLogin: string;
  createdAt: string;
}

export interface UserGlobalProfile {
  profile: UserProfileData;
  branches: {
    current: Branch;
    available: Branch[];
    canSwitch: boolean;
  };
  modules: any[];
}

export interface SwitchBranch {
  data: {
    newToken: string;
  };
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
}
