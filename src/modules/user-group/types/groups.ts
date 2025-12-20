export interface Role {
  id: string;
  name: string;
}

export interface GroupApiItem {
  id: string;
  name: string;
  description: string | null;
  groupAccessScope: number;
  UserCount: number,
  isActive?: boolean
  rolesAssingedToGroup: Role[];
}

export interface GroupApiResponse {
  data: {
    items: GroupApiItem[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  succeeded: boolean;
  statusCode: number;
}

export interface GroupTableItem {
  id: string;
  GroupName: string;
  Description: string;
  AssignedRoles: string[];
  UserCount: number;
  Created?: string;
  isActive?: boolean
}

export interface AddGroup {
  name: string;
  description: string | null;
}
