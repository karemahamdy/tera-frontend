
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
  managerId: string;
  type: string;
  description: string;
  address: string;
  operationalHours: string;
  allowNegativeBalance: boolean;
  defaultLedgerCardId: string;
  transferAccountId: string;
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
