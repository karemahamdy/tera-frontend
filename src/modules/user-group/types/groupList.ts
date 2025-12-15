export interface Role {
  id: string;
  name: string;
}

export interface GroupItem {
  id: string;
  name: string;
  description: string;
  groupAccessScope: number;
  rolesAssingedToGroup: Role[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  succeeded: boolean;
  message: string | null;
  statusCode: number;
  errorCode: string | null;
  errors: unknown;
  id: string | null;
}

export type GroupsListResponse = ApiResponse<
  PaginatedResponse<GroupItem>
>;
