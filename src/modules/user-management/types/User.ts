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
  departmentID: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  internalID: string;
  entityId: string;
  groupId: string;
  userProfileImageUrl: string;
}

export interface UserPayload {
  id?: string;
  fullName: string;
  userName: string;
  departmentID: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  internalID: string;
  groupId: string;
  password: string;
  confirmPassword: string;
  isTemporaryPassword: boolean;
  profileImage: string;
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
