export interface UserFilterBody {
  groupIds?: string[];
  department?: string;
  status?: string;
  accessScope?: number;
  pageIndex: number;
  pageSize: number;
}
export interface UserItem {
  internalId: string | null;
  username: string;
  fullName: string;
  email: string;
  departmentName: string | null;
  userGroupName: string | null;
  isAdmin: boolean;
  isActive: boolean;
  isGlobal: boolean;
  lastLogin: string | null;
}

export interface UserResponse {
  data: {
    items: UserItem[];
    totalCount: number;
  };
}
