export interface ActiveSession {
  id: string;
  user: string;
  email: string;
  img: string | null;
  branch: string;
  ipAddress: string;
  device: string;
  status: string;
  loginTime: string;
  lastActivity: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface Pagination {
  IpAddressFilter?: string;
  StatusFilter?: string;
  BranchFilter?: string;
  PageIndex: number;
  PageSize: number;
  SearchingWord?: string;
  OrderBy?: string;
  OrderDirection?: "desc" | "asc";
  total: number;
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

export type SessionResponse = ApiResponse<PaginatedResponse<ActiveSession>>;
