export interface ItemTransactions {
  operationType: string;
  sourceItemCode: string;
  targetItemCode: string;
  transactionDate: string;
  transactionsCount: number;
  warehouseCode: string;
}

export interface ItemTransactionsResponse {
  data: {
    items: ItemTransactions[];
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
  typeFilter?: string;
  pageIndex: number;
  pageSize: number;
  searchingWord?: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
}

export interface MergeOrTransferTransactionsPayload {
  sourceItemId: string;
  targetItemId: string;
  mergeTransfareType: string;
  warehouseId?: string;
  notes?: string;
}


export interface ItemInfo {
  totalQuantity: number;
  locations: number;
  transaction: number;
}