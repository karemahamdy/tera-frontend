// types/branches.ts
export interface itemList {
  id: string;
  code: string;
  name: string;
  wareHouse: string;
  baseUnitName: string;
  itemGroupName: string;
  tracked: boolean;
  isActive: boolean;
}

export interface statistics {
  totalItems?: number;
  activeItems?: number;
  outOfStockItems?: number;
  minStockItems?: number;
}
export interface itemListResponse {
  data: {

    items: itemList[];
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

export interface AdditemList {
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
  isExpanded?: boolean; 
}

export interface Pagination {
  pageIndex: number;
  pageSize?: number;
  searchingWord?: string;
  level?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  StatusFilter?: string;
  ItemGroupIds?: string[];
  WarehouseIds?: string[];
}

export interface ItemInformation {
  code: string;
  nameEn: string;
  nameAr: string | null;
  hsCode: string | null;
  description: string | null;
  productionCode: string | null;
  productionName: string | null;
  accessScope: string;
  branchName: string;
  wareHouseName: string | null;
  categoryName: string | null;
  groupName: string | null;
  itemType: string;
  manufacturer: string | null;
  manufacturerPartNumber: string | null;
  barcode: string | null;
}

export interface ItemCostInformation {
  lastMovingPrice: number;
  lastPurchasePrice: number;
  standardCost: number;
  totalValue: number;
}

export interface ItemTrackingAndParameters {
  tracked: boolean;
  reorderPoint: number | null;
  reorderQuantity: number | null;
  leadTime: number | null;
}

export interface ItemUnitOfFeature {
  unitName: string;
  factor: number;
  isBase: boolean;
}

export interface ItemGroupsOverview {
  group1Name: string | null;
  group2Name: string | null;
  group3Name: string | null;
  group4Name: string | null;
}

export interface ItemAttachment {
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
}

export interface ItemOverview {
  id: string;
  code: string;
  name: string | null;
  itemInformation: ItemInformation;
  itemCostInformation: ItemCostInformation;
  itemTrackingAndParameters: ItemTrackingAndParameters;
  itemAttachments: ItemAttachment[];
  itemUnitsOfMeasure: ItemUnitOfFeature[];
  itemGroups: ItemGroupsOverview;
}

export interface ItemTransaction {
  date: string;
  warehaouse: string;
  transactionType: string;
  transactionDocNumber: string;
  qountity: number;
  balance: number;
  unitCoust: number;
}

export interface ItemTransactionResponse {
  items: ItemTransaction[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface WarehouseStock {
  warehouseCode: string;
  zoneLocation: string;
  availableQuantity: number;
  holdQuantity: number;
  onHandQuantity: number;
}

export interface LastTransaction {
  warehauseCode: string;
  serialNumber: string;
  zoneCode: string;
  status: string;
  lastTransactionCode: string;
  transactionType: string;
  quantity: number;
}

export interface ItemStockResponse {
  warehouseStockDto: WarehouseStock[];
  lastTransactionsDto: LastTransaction[];
}

export interface PricingDetail {
  basePricing: number;
  baseOfUnitNumber: number;
  unitName: string;
  baseName: string;
}

export interface ItemPricingResponse {
  lastPurchasePriceDto: PricingDetail | null;
  lastSalsePriceDto: PricingDetail | null;
}

export interface ItemCards {
  totalOnHand: number;
  available: number;
  holdItem: number;
}
