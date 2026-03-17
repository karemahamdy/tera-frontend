export interface PurchaseReturn {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface PurchaseReturnResponse {
  data: {
    items: PurchaseReturn[];
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
  StatusFilter?: string | null;
  SupplierId?: string | null;
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
  unitPrice: number;
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

export interface Serial {
  mainSerial: string;
  quantity: number;
  batchNumber: string;
  expireDate: string;
  serialNumber2: string;
  serialNumber3: string;
  comment: string;
}
export interface PurchaseReturnForm {
  documentNumber: string;
  originalWaybillIds: string[];
  supplierId: string;
  returnDate: Date | string;
  returnReason: string;
  otherReason?: string;
  warehouseId: string;
  zoneId: string;
  lineItems: Item[];
}
