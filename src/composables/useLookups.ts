import { ref } from "vue";
import type { LookupsOption } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { LookupsService } from "@/app/services/lookups.service";

export function useLookups() {
  const groupsLookups = ref<LookupsOption[]>([]);
  const branchesLookups = ref<LookupsOption[]>([]);
  const entitiesLookups = ref<LookupsOption[]>([]);
  const reasonsLookups = ref<LookupsOption[]>([]);
  const reasonsSalesLookups = ref<LookupsOption[]>([]);
  const rolesLookups = ref<LookupsOption[]>([]);
  const screensLookups = ref<LookupsOption[]>([]);
  const CodeLookups = ref<LookupsOption[]>([]);
  const usersLookups = ref<LookupsOption[]>([]);
  const IPLookups = ref<LookupsOption[]>([]);
  const departmentsLookups = ref<LookupsOption[]>([]);
  const userAssignedBranchesLookups = ref<LookupsOption[]>([]);
  const itemTypeLookups = ref<LookupsOption[]>([]);
  const businessPartnerLookups = ref<LookupsOption[]>([]);
  const unitsLookups = ref<LookupsOption[]>([]);
  const currencyLookups = ref<LookupsOption[]>([]);
  const taxLookups = ref<LookupsOption[]>([]);
  const ledgerDetailCardLookups = ref<LookupsOption[]>([]);
  const costcenterLookups = ref<LookupsOption[]>([]);

  const categoryLookups = ref<LookupsOption[]>([]);
  const group1Lookups = ref<LookupsOption[]>([]);
  const group2Lookups = ref<LookupsOption[]>([]);
  const group3Lookups = ref<LookupsOption[]>([]);
  const group4Lookups = ref<LookupsOption[]>([]);
  const accountLookups = ref<LookupsOption[]>([]);
  const warehouseLookup = ref<LookupsOption[]>([]);
  const itemGroupLookups = ref<LookupsOption[]>([]);
  const adjustmentReasonLookups = ref<LookupsOption[]>([]);
  const itemLookups = ref<LookupsOption[]>([]);
  const processLookups = ref<LookupsOption[]>([]);
  const workCentersLookups = ref<LookupsOption[]>([]);

  const getAdjustmentReasonLookups = async () => {
    try {
      const res = await LookupsService.getAdjustmentReasonLookups();
      adjustmentReasonLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getGroupLookups = async (isActive: boolean = true) => {
    try {
      const res = await LookupsService.getGroupLookups(isActive);
      groupsLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getBranchLookups = async (isActive: boolean = true) => {
    try {
      const res = await LookupsService.getBranchLookups(isActive);
      branchesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getEntityLookups = async () => {
    try {
      const res = await LookupsService.getEntityLookups();
      entitiesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getRolesLookups = async (isActive: boolean = true) => {
    try {
      const res = await LookupsService.getRolesLookups(isActive);
      rolesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getScreenLookups = async () => {
    try {
      const res = await LookupsService.getScreenLookups();
      screensLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getModuleLookups = async () => {
    try {
      const res = await LookupsService.getModuleLookups();
      CodeLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.code,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getIPLookups = async () => {
    try {
      const res = await LookupsService.getIPLookups();
      IPLookups.value = res.data.map((group) => ({
        label: group.ipAddressName,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getDepartmentsLookups = async (isActive: boolean = true) => {
    try {
      const res = await LookupsService.getDepartmentsLookups(isActive);
      departmentsLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getUsersLookups = async () => {
    try {
      const res = await LookupsService.getUsersLookups();
      usersLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getUserAssignedBranchesLookups = async () => {
    try {
      const res = await LookupsService.getUserAssignedBranchesLookups();
      userAssignedBranchesLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemCategoryLookups = async () => {
    try {
      const res = await LookupsService.getItemClassificationLookups("Category");
      categoryLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemGroup1Lookups = async () => {
    try {
      const res = await LookupsService.getItemClassificationLookups("Group1");
      group1Lookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemGroup2Lookups = async () => {
    try {
      const res = await LookupsService.getItemClassificationLookups("Group2");
      group2Lookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemGroup3Lookups = async () => {
    try {
      const res = await LookupsService.getItemClassificationLookups("Group3");
      group3Lookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemGroup4Lookups = async () => {
    try {
      const res = await LookupsService.getItemClassificationLookups("Group4");
      group4Lookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemTypeLookups = async () => {
    try {
      const res = await LookupsService.getItemTypeLookups();
      itemTypeLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getBusinessPartnerLookups = async () => {
    try {
      const res = await LookupsService.getBusinessPartnerLookups();
      businessPartnerLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getUnitsLookups = async () => {
    try {
      const res = await LookupsService.getUnitsLookups();
      unitsLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getCurrencyLookups = async () => {
    try {
      const res = await LookupsService.getCurrencyLookups();
      currencyLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getTaxLookups = async () => {
    try {
      const res = await LookupsService.getTaxLookups();
      taxLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getLedgerDetailCardLookups = async () => {
    try {
      const res = await LookupsService.getLedgerDetailCardLookups();
      ledgerDetailCardLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getCostcenterLookups = async () => {
    try {
      const res = await LookupsService.getCostcenterLookups();
      costcenterLookups.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getAccountsLookups = async () => {
    try {
      const res = await LookupsService.getAccountsLookups();
      accountLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const getItemLookups = async () => {
    try {
      const res = await LookupsService.getItemLookups();
      itemLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  
  const getWarehouseLookups = async () => {
    try {
      const res = await LookupsService.getWarehouseLookups();
      warehouseLookup.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getItemGroupLookups = async () => {
    try {
      const res = await LookupsService.getItemGroupLookups();
      itemGroupLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getReasonLookups = async () => {
    try {
      const res = await LookupsService.getReasonLookups();
      reasonsLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.value,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
    const getSalesReasonLookups = async () => {
    try {
      const res = await LookupsService.getSalesReasonLookups();
      reasonsSalesLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.name,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
    const getProcessLookups = async () => {
    try {
      const res = await LookupsService.getProcessLookups();
      processLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };
   const getWorkCentersLookups = async () => {
    try {
      const res = await LookupsService.getWorkCentersLookups();
      workCentersLookups.value = res.data.map((group) => ({
        label: group.name,
        value: group.id,
      }));
    } catch (error) {
      toastService.error(error as string);
    }
  };

  return {
    groupsLookups,
    branchesLookups,
    entitiesLookups,
    reasonsLookups,
    rolesLookups,
    screensLookups,
    CodeLookups,
    departmentsLookups,
    usersLookups,
    IPLookups,
    userAssignedBranchesLookups,
    categoryLookups,
    group1Lookups,
    group2Lookups,
    group3Lookups,
    group4Lookups,
    itemTypeLookups,
    businessPartnerLookups,
    unitsLookups,
    currencyLookups,
    taxLookups,
    ledgerDetailCardLookups,
    costcenterLookups,
    accountLookups,
    warehouseLookup,
    itemGroupLookups,
    adjustmentReasonLookups,
    itemLookups,
    reasonsSalesLookups,
    processLookups,
    workCentersLookups,
    getWorkCentersLookups,
    getProcessLookups,
    getAdjustmentReasonLookups,
    getIPLookups,
    getReasonLookups,
    getGroupLookups,
    getBranchLookups,
    getEntityLookups,
    getRolesLookups,
    getScreenLookups,
    getItemGroupLookups,
    getWarehouseLookups,
    getDepartmentsLookups,
    getModuleLookups,
    getUsersLookups,
    getUserAssignedBranchesLookups,
    getItemCategoryLookups,
    getItemGroup1Lookups,
    getItemGroup2Lookups,
    getItemGroup3Lookups,
    getItemGroup4Lookups,
    getItemTypeLookups,
    getBusinessPartnerLookups,
    getUnitsLookups,
    getCurrencyLookups,
    getTaxLookups,
    getLedgerDetailCardLookups,
    getCostcenterLookups,
    getAccountsLookups,
    getItemLookups,
    getSalesReasonLookups
  };
}
