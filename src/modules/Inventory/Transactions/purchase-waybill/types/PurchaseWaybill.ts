export interface PurchaseWaybill {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  createAt: string;
}

export interface PurchaseWaybillResponse {
  data: {
    items: PurchaseWaybill[];
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
  StatusFilter?: any;
}

// ─── Get-by-ID response types ───────────────────────────────────────────────

export interface SupplierDetailsData {
  waybillNumber: string;
  supplierId: string;
  supplierName: string;
  supplierSalesOrder: string | null;
  purchaseOrderRef: string | null;
  externalReference: string | null;
  waybillDate: string;
  expectedDeliveryDate: string | null;
}

export interface PaymentTermsData {
  currencyId: string;
  currencyCode: string;
  exchangeRate: number;
  rateDate: string;
  baseCurrencyId: string;
  baseCurrencyCode: string;
}

export interface WarehouseDetailsData {
  warehouseId: string;
  warehouseName: string;
  zoneId: string | null;
  zoneName: string | null;
}

export interface Serial {
  id: string;
  mainSerial: string;
  quantity: number;
  batchNumber: string | null;
  expireDate: string | null;
}

export interface LineItem {
  id: string;
  lineNumber: number;
  itemId: string;
  itemCode: string;
  itemName: string;
  unitId: string;
  unitName: string;
  quantity: number;
  quantityBase: number;
  warehouseId: string;
  warehouseName: string;
  zoneId: string | null;
  zoneName: string | null;
  locationId: string | null;
  locationCode: string | null;
  unitPrice: number;
  unitPriceBase: number;
  unitTaxPercent: number;
  lineTotal: number;
  lineTotalBase: number;
  note: string | null;
  isBlocked: boolean;
  serials: Serial[];
}

export interface PaymentInfoData {
  paymentType: string;
  paymentTypeName: string;
  paymentTermId: string | null;
  paymentTermName: string | null;
  purchaseType: string;
  incoterm: string | null;
  subTotal: number;
  subTotalBase: number;
  totalTax: number;
  taxAmountBase: number;
  globalDiscount: number;
  discountAmountBase: number;
  grandTotal: number;
  grandTotalBase: number;
}

export interface NotesData {
  comment1: string | null;
  comment2: string | null;
  comment3: string | null;
  comment4: string | null;
  comment5: string | null;
  note: string | null;
}

export interface PurchaseWaybillDetail {
  id: string;
  transactionType: number;
  status: string;
  supplierDetails: SupplierDetailsData;
  paymentTerms: PaymentTermsData;
  warehouseDetails: WarehouseDetailsData;
  lineItems: LineItem[];
  paymentInfo: PaymentInfoData;
  notes: NotesData;
  createdDate: string;
  createdBy: string;
}

export interface PurchaseWaybillByIdResponse {
  data: PurchaseWaybillDetail;
  succeeded: boolean;
  message: string;
  statusCode: number;
  errorCode: string | null;
  errors: any;
  id: string | null;
}
