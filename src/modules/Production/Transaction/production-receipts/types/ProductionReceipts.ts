export interface ProductionReceipts {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface ProductionReceiptsResponse {
  data: {
    items: ProductionReceipts[];
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
  StatusFilter?: string;
}
