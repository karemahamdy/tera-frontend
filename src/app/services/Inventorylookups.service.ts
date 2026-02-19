import axiosWrapper from "@/app/http/axiosWrapper";
import type {  ApiResponse, InventoryLookups } from "../types/lookups";

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
};
