export interface Pagination {
  GroupFilter?: string;
  StatusFilter?: string;
  ScopeFilter?: string;
  DepartmantFilter?: string;
  PageIndex: number;
  PageSize: number;
  SearchingWord?: string;
  OrderBy?: string;
  OrderDirection?: "desc" | "asc";
  total: number;
}
export interface UserByID {
  id?: string;
  userId: string;
  fullName: string;
  userName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  userProfileImageUrl?: string | null;

  internalID?: string | null;
  departmentID?: string | null;
  groupId?: string | null;
}

export interface UserPayload {
  id?: string;
  fullName: string;
  userName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  password: string;
  confirmPassword: string;
  IsTemporaryPassword?: boolean;
  ProfileImage?: string | null;

  internalID?: string | null;
  departmentID?: string | null;
  groupId?: string | null;
}

export interface UserListItem {
  userId: string;
  fullName: string;
  department: {
    id: string;
    name: string;
  } | null;
  isGlobal: boolean;
  isActive: boolean;
  isAdmin: boolean;
  lastLogin: string;
  userProfileImageUrl: string | null;
  group: {
    id: string;
    name: string;
  };
}

export interface UserList {
  data: {
    items: UserListItem[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface PasswordResetForm {
  targetUserId: string;
  newPassword: string;
  confirmPassword: string;
}
// -----------------------------------------------------------------------
export interface PermissionDto {
  name: string;
  screenCode: string;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
}

export interface RolePayload {
  id?: string;
  name: string;
  description: string;
  permissionDtos: PermissionDto[];
}

export interface RoleListItem {
  id: string;
  name: string;
  discription: string;
  userAssigned: number;
  createAt: string;
}

export interface RoleListResponse {
  data: {
    items: RoleListItem[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface RoleItem {
  id: string;
  name: string;
}

export interface Permission {
  moduleCode: string;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isView: boolean;
  permissionDtos: PermissionDto[];
}
