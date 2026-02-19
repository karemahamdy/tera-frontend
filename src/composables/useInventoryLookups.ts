import { ref } from "vue";
import type { LookupsOption } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { InventoryLookupsService } from "@/app/services/Inventorylookups.service";

 
export function useLookups() {
  const supplierLookups = ref<LookupsOption[]>([]);
  const CurrenciesLookups = ref<LookupsOption[]>([]);
  const IncotermsLookups = ref<LookupsOption[]>([]);
  const PaymentTerms = ref<LookupsOption[]>([]);

 const getSupplierLookups = async () => {
    try {
      const res = await InventoryLookupsService.getSupplierLookups();
      supplierLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
   const getPaymentTermsLookups = async () => {
    try {
      const res = await InventoryLookupsService.getPaymentTermsLookups();
      PaymentTerms.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
   const getIncotermsLookups = async () => {
    try {
      const res = await InventoryLookupsService.getIncotermsLookups();
      IncotermsLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
   const getCurrenciesLookups = async () => {
    try {
      const res = await InventoryLookupsService.getCurrenciesLookups();
      CurrenciesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  return {
   getSupplierLookups,
   getCurrenciesLookups,
   getIncotermsLookups,
   getPaymentTermsLookups,
   supplierLookups,
   CurrenciesLookups,
   IncotermsLookups,
   PaymentTerms
  };
}
