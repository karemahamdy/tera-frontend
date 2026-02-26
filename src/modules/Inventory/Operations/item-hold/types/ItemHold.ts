export interface ItemHold {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface ItemHoldResponse {
  data: {
    items: ItemHold[];
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
  itemTypeHoldFilter?: string | null;
}

export interface ReleaseItemPayload {
  transactionLineId: string;
  itemId: string;
}

export interface ReleaseSerialPayload {
  transactionLineId: string;
  itemId: string;
  mainSerial: string;
}

export type ItemHoldType = "QCHold" | "DamageHold" | "Investigation";

export interface ItemHoldTransaction {
  transactionLineId: string;
  itemId: string;
  warehouseId: string;
  code: string;
  itemName: string;
  warehouseName: string;
  zone: string; // empty string in your example (not null)
  quantity: number; // can be negative
  reason: string | null;
  holdDate: string; // change to Date if parsed
  type: ItemHoldType;
  hasSerial: boolean;
  documentNumberAsSerial: string;
}

export interface ItemSerialTransaction {
  quantity: number;
  expiryDate: string; // change to Date if parsed
  batch: string | null;
  comment: string | null;
  serial2And3: string; // looks like optional extra serial data
  transactionLineId: string;
  itemId: string;
  mainSerial: string;
}

export interface ItemSerialTransactionResponse {
  data: {
    items: ItemSerialTransaction[];
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



export interface SelectedItem {
  id: string;
  code: string;
  name: string;
  trackingType: string;
}

export interface ItemHoldPayload {
  itemId: string;
  warehouseId: string;
  holdQuantity: number;
  reason: string | null;
  holdDate: string; // consider using Date type if you will parse it
  itemHoldStatus: string | null; // consider using enum if there are fixed statuses
  serialsForBlocking: string[] | null;
}