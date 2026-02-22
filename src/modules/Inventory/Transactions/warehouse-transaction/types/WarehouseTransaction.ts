export interface WarehouseTransaction {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface WarehouseTransactionResponse {
  data: {
    items: WarehouseTransaction[];
    PageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  succeeded: boolean;
  message: string | null;
  statusCode: number;
  errorCode: string | null;
  errors: any;
  id: string | null;
}

export interface Pagination {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  TransactionStatus?: string;
  TransactionType?: string;
  WarehouseIds?: string;
}
