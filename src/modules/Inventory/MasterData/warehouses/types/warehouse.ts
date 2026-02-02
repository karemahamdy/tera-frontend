// types/branches.ts
export interface warehouses {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  addressEn?: string;
  addressAr?: string;
  isActive: boolean;
  createAt: string;
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

export interface AddWarehouses {
  code: string;
  nameAr: string;
  nameEn: string;
  addressEn?: string;
  addressAr?: string;
  isActive?: boolean;
}

export interface Location {
  code: string;
  row: string;
  column: string;
  rack: string;
}

export interface Zone {
  id: string;
  code: string;
  name: string;
  rows: number;
  columns: number;
  racks: number;
  locations: Location[];
  isExpanded?: boolean; // For UI toggle
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
