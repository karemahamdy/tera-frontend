export interface PhysicalCount {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface PhysicalCountResponse {
  data: {
    items: PhysicalCount[];
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

export interface InventoryCountLine {
  id: string;
  itemId: string;
  itemName: string;
  countedId: string;
  itemCode: string;
  warehouseId: string;
  warehouseName: string;
  zoneName: string | null;
  locationCode: string | null;
  actualQty: number;
  countedQty: number;
  varianceQty: number;
  hasSerials: boolean;
}

export type InventoryCountStatus =
  | "Draft"
  | "Posted"
  | "Cancelled";

export interface PhysicalCountById {
  id: string;
  code: string;
  notes: string;
  countDate: string; // change to Date if you parse it
  status: InventoryCountStatus;
  adjustmentId: string | null;
  adjustmentDocumentNumber: string | null;
  zoneName: string | null;
  zoneCode: string | null;
  lines: InventoryCountLine[];
}

export interface PhysicalCountSerial {
  id: string;
  physicalCountLineId: string;
  mainSerial: string;
  actualQty: number;
  countedQty: number;
  varianceQty: number;
}
