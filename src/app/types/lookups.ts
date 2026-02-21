export interface Lookups {
  name: string;
  id: string;
}
export interface CodeLookups {
  code: string;
  name: string;
}
export interface IPLookups {
  ipAddressName: string;
  id: string;
}
export interface LookupsOption {
  label: string;
  value: string;
  type?: string;
}

export interface reasonsLookups {
  name: string;
  value: string;
}

export interface InventoryLookups {
  code: string;
  name: string;
  id?: string;
  type?: string;
}

export interface ItemLookupUnit {
  unitId: string;
  unitCode: string;
  unitName: string;
  conversionFactor: number;
  isBaseUnit: boolean;
}

export interface ItemLookup {
  id: string;
  code: string;
  name: string;
  barcode: string | null;
  itemType: string;
  trackingType: string;
  baseUnitId: string;
  baseUnitName: string;
  units: ItemLookupUnit[];
}

export interface ApiResponse<T> {
  data: T;
  succeeded: boolean;
  message: string;
  statusCode: number;
  errorCode?: string | null;
  errors?: any;
  id?: any;
}
