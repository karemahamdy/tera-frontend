export interface AuditLog {
  entityName: string;
  userName: string | null;
  branchNameAr: string | null;
  branchNameEn: string | null;
  actionType: number;
  moduleName: string;
  screenName: string;
  transactionNumber: string;
  timestamp: string;
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

export type LogsListResponse = ApiResponse<
  PaginatedResponse<AuditLog>
>;
