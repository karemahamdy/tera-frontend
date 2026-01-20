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

export interface Addwarehouses {
  code: string;
  nameAr: string;
  nameEn: string;
  addressEn?: string;
  addressAr?: string;
  isActive?: boolean;
}
