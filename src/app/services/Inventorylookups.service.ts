import axiosWrapper from "@/app/http/axiosWrapper";
import type {
  ApiResponse,
  InventoryLookups,
  ItemLookup,
  Lookups,
} from "../types/lookups";

export const InventoryLookupsService = {
  getCurrenciesLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/currencies`,
    );
  },
  getSupplierLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/suppliers`,
    );
  },
  getCustomerLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/customers`,
    );
  },
  getPaymentTermsLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/payment-terms`,
    );
  },
  getWarehouseLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/warehouses`,
    );
  },
  getZonesLookups(warehouseId: string) {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/zones?warehouseId=${warehouseId}`,
    );
  },
  getIncotermsLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/incoterms`,
    );
  },
  getItemsLookups() {
    return axiosWrapper.get<ApiResponse<ItemLookup[]>>(
      `/InventoryLookups/items?trackedOnly=false`,
    );
  },
  getCostCenterLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>(
      `/Lookups/CostcenterLookups?isActive=true`,
    );
  },
  getWarehouseHierarchyLookups() {
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/Lookups/warehouse-hierarchy-lookups`,
    );
  },
  getItemSerials(
    itemId: string,
    warehouseId: string,
    zoneId?: string | null,
    locationId?: string | null,
  ) {
    let url = `/InventoryLookups/item-serials?itemId=${itemId}&warehouseId=${warehouseId}`;
    if (zoneId) url += `&zoneId=${zoneId}`;
    if (locationId) url += `&locationId=${locationId}`;
    return axiosWrapper.get<ApiResponse<any[]>>(url);
  },
  getItemBalance(
    itemId: string,
    warehouseId: string,
    zoneId?: string | null,
    locationId?: string | null,
  ) {
    let url = `/InventoryLookups/item-balance?itemId=${itemId}&warehouseId=${warehouseId}`;
    if (zoneId) url += `&zoneId=${zoneId}`;
    if (locationId) url += `&locationId=${locationId}`;
    return axiosWrapper.get<ApiResponse<any>>(url);
  },
  getItemSerialsLookups(params: {
    itemId: string;
    warehouseId: string;
    zoneId?: string;
    locationId?: string;
  }) {
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/InventoryLookups/item-serials`,
      {
        params,
      },
    );
  },

  getInventoryLookupsPurchaseWaybills(supplierId: string) {
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/InventoryLookups/purchase-waybills?supplierId=${supplierId}`,
    );
  },

  getInventoryLookupsPurchaseWaybillsItems(waybillIds: string[]) {
    const params = { waybillIds };
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/InventoryLookups/purchase-waybills/items`,
      {
        params,
        paramsSerializer: (params) => {
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => queryParams.append(key, item));
            } else if (value !== undefined && value !== null) {
              queryParams.append(key, value as string);
            }
          });
          return queryParams.toString();
        },
      },
    );
  },

  getInventoryLookupsSalesWaybills(customerId: string) {
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/InventoryLookups/sales-waybills?customerId=${customerId}`,
    );
  },

  getInventoryLookupsSalesWaybillsItems(waybillIds: string[]) {
    const params = { waybillIds };
    return axiosWrapper.get<ApiResponse<any[]>>(
      `/InventoryLookups/sales-waybills/items`,
      {
        params,
        paramsSerializer: (params) => {
          const queryParams = new URLSearchParams();
          Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((item) => queryParams.append(key, item));
            } else if (value !== undefined && value !== null) {
              queryParams.append(key, value as string);
            }
          });
          return queryParams.toString();
        },
      },
    );
  },
};
