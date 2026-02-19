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
  //  getImportTypeLookups() {
  //   return axiosWrapperget<ApiResponse<InventoryLookups[]>>(
  //     `/InventoryLookups/currencies`,
  //   );
  // },
   getIncotermsLookups() {
    return axiosWrapper.get<ApiResponse<InventoryLookups[]>>(
      `/InventoryLookups/incoterms`,
    );
  },
};
