import { ref } from "vue";
import type { LookupsOption, ItemLookup } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { InventoryLookupsService } from "@/app/services/Inventorylookups.service";
import { LookupsService } from "@/app/services/lookups.service";

export function useInventoryLookups() {
  const supplierLookups = ref<LookupsOption[]>([]);
  const customerLookups = ref<LookupsOption[]>([]);
  const CurrenciesLookups = ref<LookupsOption[]>([]);
  const IncotermsLookups = ref<LookupsOption[]>([]);
  const WarehouseLookups = ref<LookupsOption[]>([]);
  const PaymentTerms = ref<LookupsOption[]>([]);
  const ZonesLookups = ref<LookupsOption[]>([]);
  const itemsLookups = ref<ItemLookup[]>([]);
  const UnitsLookups = ref<LookupsOption[]>([]);
  const costCenterLookups = ref<LookupsOption[]>([]);
  const WarehouseHierarchyLookups = ref<any[]>([]);
  const serialsLookups = ref<any[]>([]);
  const itemBalance = ref<number>(0);

  const ItemsSerialsLookups = ref<any[]>([]);

  const purchaseWaybills = ref<any[]>([]);
  const purchaseWaybillsItems = ref<any[]>([]);

  const salesWaybills = ref<any[]>([]);
  const salesWaybillsItems = ref<any[]>([]);

  const getItemSerialsLookups = async (params: {
    itemId: string;
    warehouseId: string;
    zoneId?: string;
    locationId?: string;
  }) => {
    try {
      const res = await InventoryLookupsService.getItemSerialsLookups(params);
      ItemsSerialsLookups.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };

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
  const getCustomerLookups = async () => {
    try {
      const res = await InventoryLookupsService.getCustomerLookups();
      customerLookups.value = res.data.map((group) => ({
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
        value: group.id || "",
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
  const getItemsLookups = async () => {
    try {
      const res = await InventoryLookupsService.getItemsLookups();
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
        value: u.id,
        type: u.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getCostCenterLookups = async () => {
    try {
      const res = await LookupsService.getCostcenterLookups();
      costCenterLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getWarehouseHierarchyLookups = async () => {
    try {
      const res = await InventoryLookupsService.getWarehouseHierarchyLookups();
      WarehouseHierarchyLookups.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getItemSerials = async (
    itemId: string,
    warehouseId: string,
    zoneId?: string | null,
    locationId?: string | null,
  ) => {
    try {
      const res = await InventoryLookupsService.getItemSerials(
        itemId,
        warehouseId,
        zoneId,
        locationId,
      );
      serialsLookups.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getItemBalance = async (
    itemId: string,
    warehouseId: string,
    zoneId?: string | null,
    locationId?: string | null,
  ) => {
    try {
      const res = await InventoryLookupsService.getItemBalance(
        itemId,
        warehouseId,
        zoneId,
        locationId,
      );
      return res.data?.totalBalance ?? res.data ?? 0;
    } catch (error) {
      toastService.error(error as string);
      return 0;
    }
  };

  const getInventoryLookupsPurchaseWaybills = async (supplierId: string) => {
    try {
      const res =
        await InventoryLookupsService.getInventoryLookupsPurchaseWaybills(
          supplierId,
        );
      purchaseWaybills.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getInventoryLookupsPurchaseWaybillsItems = async (
    waybillIds: string[],
  ) => {
    try {
      const res =
        await InventoryLookupsService.getInventoryLookupsPurchaseWaybillsItems(
          waybillIds,
        );
      purchaseWaybillsItems.value = res.data;
    } catch (error) {
      toastService.error(error as string);
      return [];
    }
  };


  const getInventoryLookupsSalesWaybills = async (customerId: string) => {
    try {
      const res =
        await InventoryLookupsService.getInventoryLookupsSalesWaybills(
          customerId,
        );
      salesWaybills.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getInventoryLookupsSalesWaybillsItems = async (
    waybillIds: string[],
  ) => {
    try {
      const res =
        await InventoryLookupsService.getInventoryLookupsSalesWaybillsItems(
          waybillIds,
        );
      salesWaybillsItems.value = res.data;
    } catch (error) {
      toastService.error(error as string);
      return [];
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
    getCostCenterLookups,
    getWarehouseHierarchyLookups,
    getItemSerials,
    getItemBalance,
    getItemSerialsLookups,
    getCustomerLookups,
    getInventoryLookupsPurchaseWaybills,
    getInventoryLookupsPurchaseWaybillsItems,
    getInventoryLookupsSalesWaybills,
    getInventoryLookupsSalesWaybillsItems,
    salesWaybills,
    salesWaybillsItems,
    purchaseWaybillsItems,
    purchaseWaybills,
    customerLookups,
    ItemsSerialsLookups,
    ZonesLookups,
    supplierLookups,
    CurrenciesLookups,
    IncotermsLookups,
    PaymentTerms,
    WarehouseLookups,
    itemsLookups,
    UnitsLookups,
    costCenterLookups,
    WarehouseHierarchyLookups,
    serialsLookups,
    itemBalance,
  };
}
