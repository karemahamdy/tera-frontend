export interface InventoryRequest {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface InventoryRequestResponse {
  data: {
    items: InventoryRequest[];
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
  TransactionType?: string | null;
}

export interface Serial {
  id: string;
  mainSerial: string;
  quantity: number;
  batchNumber: string | null;
  expireDate: string | null;
}

export interface LineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  quantityBase: number;
  warehouseId: string;
  warehouseName: string;
  zoneId: string | null;
  zoneName: string | null;
  locationId: string | null;
  locationCode: string | null;
  unitPrice: number;
  unitPriceBase: number;
  unitTaxPercent: number;
  lineTotal: number;
  lineTotalBase: number;
  note: string | null;
  isBlocked: boolean;
  serials: Serial[];
}