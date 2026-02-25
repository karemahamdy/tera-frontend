import axiosWrapper from "@/app/http/axiosWrapper";
import type { ApiResponse, InventoryLookups, ItemLookup, Lookups } from "../types/lookups";

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
  getItemsLookups(trackedOnly: boolean = false) {
    return axiosWrapper.get<ApiResponse<ItemLookup[]>>(
      `/InventoryLookups/items?trackedOnly=${trackedOnly}`,
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
};
