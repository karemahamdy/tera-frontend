export interface InventoryAdjustment {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface InventoryAdjustmentResponse {
  data: {
    items: InventoryAdjustment[];
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
  ReasonFilter?: string;
}



export interface AdjustmentLine {
  id: string;
  lineNumber: number;
  itemId: string;
  itemName: string;
  itemCode: string;
  unitName: string;
  quantity: number;
  quantityBase: number;
  warehouseName: string;
  zoneName: string | null;
  locationCode: string | null;
  serials: string[]; // assuming serials are strings
}

export type AdjustmentStatus = "Pending" | "Approved" | "Rejected";
export type AdjustmentDirection = "In" | "Out";

export interface InventoryAdjustmentById {
  id: string;
  documentNumber: string;
  transactionDate: string; // or Date if you parse it
  warehouseName: string;
  zoneName: string | null;
  adjustmentReason: string; // can also be union if you have fixed reasons
  status: AdjustmentStatus;
  direction: AdjustmentDirection;
  lines: AdjustmentLine[];
}


export interface PhysicalCountItem {
  itemId: string;
  itemName: string;
  itemCode: string;
  countedId: string;
  countedCode: string;
  warehouseName: string;
  countedQuantity: number;
  variance: number;
  availableBalance: number;
  physicalHeaderId: string;
};
export interface CreateInventoryAdjustmentPayload {
  adjustmentReason: string;
  physicalCountHeaderIds: PhysicalCountItem[];
  adjustmentNumber: string;
  notes?: string | null;
}
