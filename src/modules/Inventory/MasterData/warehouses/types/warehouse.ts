
export interface warehouses {
  id: string;
  code: string;
  name: string;
  address: string;
  isActive: boolean;
  type: string;
  zonesCount: number;
  transferAccount: string | null;

}

export interface warehousesResponse {
  data: {
    items: warehouses[];
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

export interface LocationRequest {
  code: string;
  row: string;
  column: string;
  rack: string;
}

export interface Zone {
  code: string;
  name: string;
  rows: number;
  columns: number;
  racks: number;
  locationRequest: LocationRequest[];
  isExpanded?: boolean;
  id?: string; // Optional for UI tracking
}

export interface AddWarehouses {
  code: string;
  nameEn: string;
  nameAr: string;
  managerId: string | null;
  type: string;
  description: string | null;
  address: string | null;

  // Form-specific fields
  fromTime?: Date | null;
  toTime?: Date | null;

  // Payload-specific fields
  operationalHours?: string | null;

  allowNegativeBalance: boolean;
  defaultLedgerCardId: string | null;
  transferAccountId: string | null;
  isActive: boolean;
  zones: Zone[];
}

export interface Pagination {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  level?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  WarehouseType?: string;
  IsActive?: string;
}
