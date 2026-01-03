export interface Role {
  id: string;
  name: string;
}

export interface GroupApiItem {
  id: string;
  name: string;
  description: string | null;
  createAt?: string;
  userAssigned: number;
  isActive?: boolean;
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
  AssignedRoles: string[] | string;
  userAssigned: number;
  createAt?: string;
  isActive?: boolean;
}

export interface AddGroup {
  name: string;
  description: string | null;
}

export interface ListResponse {
  data: { items: GroupApiItem[] };
}

export interface ItemResponse {
  data: GroupApiItem;
}

export interface pageParams {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}