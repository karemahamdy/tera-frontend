export interface UserFilterBody {
  groupIds?: string[];
  department?: string;
  status?: string;
  accessScope?: number;
  isActive?: boolean; // New
  isGlobal?: boolean; // New
  pageIndex: number;
  pageSize: number;
}

export interface GroupFilterBody {
  groupIds?: string[];
  rolesIds?: string;
  status?: string;
  isActive?: boolean; // New
  isGlobal?: boolean; // New
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

export interface GroupItem {
  createdDate: string | null;
  userCount: number;
  assignedRoles: string;
  description: string | null;
  groupName: string | null;
  isActive: boolean;
}


export interface UserResponse {
  data: {
    items: UserItem[];
    totalCount: number;
  };
}
export interface GroupResponse {
  data: {
    items: UserItem[];
    totalCount: number;
  };
}