import { ref } from "vue";
import type { LookupsOption, ItemLookup } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { InventoryLookupsService } from "@/app/services/Inventorylookups.service";
import { LookupsService } from "@/app/services/lookups.service";


export function useInventoryLookups() {
  const supplierLookups = ref<LookupsOption[]>([]);
  const CurrenciesLookups = ref<LookupsOption[]>([]);
  const IncotermsLookups = ref<LookupsOption[]>([]);
  const WarehouseLookups = ref<LookupsOption[]>([]);
  const PaymentTerms = ref<LookupsOption[]>([]);
  const ZonesLookups = ref<LookupsOption[]>([]);
  const itemsLookups = ref<ItemLookup[]>([]);
  const UnitsLookups = ref<LookupsOption[]>([]);

  const getSupplierLookups = async () => {
    try {
      const res = await InventoryLookupsService.getSupplierLookups();
      supplierLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id || "",
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
        value: group.id || "",
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getWarehouseLookups = async () => {
    try {
      const res = await InventoryLookupsService.getWarehouseLookups();
      WarehouseLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id || "",
        type: group.type,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getZonesLookups = async (warehouseId: string) => {
    try {
      const res = await InventoryLookupsService.getZonesLookups(warehouseId);
      ZonesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id || "",
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemsLookups = async (trackedOnly: boolean = false) => {
    try {
      const res = await InventoryLookupsService.getItemsLookups(trackedOnly);
      itemsLookups.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getUnitsLookups = async () => {
    try {
      const res = await LookupsService.getUnitsLookups();
      UnitsLookups.value = res.data.map((u: any) => ({
        label: u.name,
        value: u.name,
        type: u.id
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
    getWarehouseLookups,
    getZonesLookups,
    getItemsLookups,
    getUnitsLookups,
    ZonesLookups,
    supplierLookups,
    CurrenciesLookups,
    IncotermsLookups,
    PaymentTerms,
    WarehouseLookups,
    itemsLookups,
    UnitsLookups
  };
}
