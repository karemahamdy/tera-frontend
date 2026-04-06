export interface Pagination {
  PageIndex: number;
  PageSize: number;
  OrderBy?: string;
  OrderDirection?: "desc" | "asc";
  total: number;
}

export interface AssignRole {
  userId: string;
  accessScope: 1 | 2;
  roleId: string[] | string;
  branchIds?: string[];
}

export interface Role {
  userId: string;
  roleId: string;
  roleName: string;
  userAccessScope: string;
  branchNames: string[];
}

export interface RolesList {
  data: Role[];
}

export interface UserRole {
  userId: string;
  roleId: string;
  roleName: string;
  userAccessScope: 1 | 2;
  branchNames: string[];
  branchIds: string[];
  permissions: string[];
}
