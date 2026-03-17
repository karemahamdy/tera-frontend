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

export type InventoryCountStatus = "Draft" | "Posted" | "Cancelled";

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

export interface Serial {
  mainSerial: string;
  countedQty: number;
}

export interface Line {
  warehouseId: string | null;
  zoneId: string | null;
  itemName: string;
  itemCode: string;
  locationId: string | null;
  itemId: string;
  locationName: string;
  countedQty: number;
  trackingType: string;
  physicalCountSerials: Serial[];
}

export interface PhysicalCountForm {
  code: string;
  countDate: string | Date;
  notes: string;
  physicalCountLines: Line[];
}


export interface Unit {
  unitId: string;
  unitCode: string;
  unitName: string;
  conversionFactor: number;
  isBaseUnit: boolean;
}

export interface UnitLookup {
  label: string;
  value: string;
}

export interface Item {
  itemId: string;
  itemName: string;
  itemCode: string;
  unitId: string;
  quantity: number;
  warehouseId: string | null;
  zoneId: string | null;
  locationId: string | null;
  locationName?: string | null;
  sourceLineId: string | null;
  originalWaybillId: string | null;
  trackingType: "Serial" | "Batch" | "None";
  serials: Serial[] | null;
  units?: Unit[] | null;
  documentNumber?: string | null;
}
