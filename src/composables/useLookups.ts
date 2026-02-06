import { ref } from "vue";
import type { LookupsOption } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { LookupsService } from "@/app/services/lookups.service";

export function useLookups() {
  const groupsLookups = ref<LookupsOption[]>([]);
  const branchesLookups = ref<LookupsOption[]>([]);
  const entitiesLookups = ref<LookupsOption[]>([]);
  const rolesLookups = ref<LookupsOption[]>([]);
  const screensLookups = ref<LookupsOption[]>([]);
  const CodeLookups = ref<LookupsOption[]>([]);
  const usersLookups = ref<LookupsOption[]>([]);
  const IPLookups = ref<LookupsOption[]>([]);
  const departmentsLookups = ref<LookupsOption[]>([]);
  const accountLookups = ref<LookupsOption[]>([]);
  const warehouseLookup = ref<LookupsOption[]>([]);
  const itemGroupLookups = ref<LookupsOption[]>([]);
  const ledgerDetailCardLookups = ref<LookupsOption[]>([]);

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
     const getLedgerDetailCardLookups = async () => {
      try {
        const res = await LookupsService.getLedgerDetailCardLookups();
        ledgerDetailCardLookups.value = res.data.map((group) => ({
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

  return {
    groupsLookups,
    branchesLookups,
    entitiesLookups,
    rolesLookups,
    screensLookups,
    CodeLookups,
    departmentsLookups,
    usersLookups,
    IPLookups,
    accountLookups,
      warehouseLookup,
    itemGroupLookups,
      ledgerDetailCardLookups,
      getLedgerDetailCardLookups,
    getIPLookups,
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
    getAccountsLookups
  };
}
