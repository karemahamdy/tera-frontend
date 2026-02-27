export interface OpeningBalance {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface OpeningBalanceResponse {
  data: {
    items: OpeningBalance[];
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
  WarehouseFilter?: string | null;
  UoM?: string | null;
}


export interface SelectedItem {
  id: string;
  code: string;
  name: string;
  trackingType: string;
}
