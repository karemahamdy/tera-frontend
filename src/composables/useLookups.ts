import { ref } from "vue";
import type { Lookups } from "../app/types/lookups";
import { toastService } from "@/app/services/toastService";
import { LookupsService } from "@/app/services/lookups.service";

export function useLookups() {

  const groupsLookups = ref<Lookups[]>([]);
  const branchesLookups = ref<Lookups[]>([]);
  const entitiesLookups = ref<Lookups[]>([]);
  const rolesLookups = ref<Lookups[]>([]);
  const screensLookups = ref<Lookups[]>([]);
  const departmentsLookups = ref<Lookups[]>([]);

  const getGroupLookups = async () => {
    try {
      const res = await LookupsService.getGroupLookups();
      groupsLookups.value = res.data as Lookups[];
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getBranchLookups = async () => {
    try {
      const res = await LookupsService.getBranchLookups();
      branchesLookups.value = res.data as Lookups[];
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getEntityLookups = async () => {
    try {
      const res = await LookupsService.getEntityLookups();
      entitiesLookups.value = res.data as Lookups[];
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getRolesLookups = async () => {
    try {
      const res = await LookupsService.getRolesLookups();
      rolesLookups.value = res.data as Lookups[];
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getScreenLookups = async () => {
    try {
      const res = await LookupsService.getScreenLookups();
      screensLookups.value = res.data as Lookups[];
    } catch (error) {
      toastService.error(error as string);
    }
  };
  const getDepartmentsLookups = async () => {
    try {
      const res = await LookupsService.getDepartmentsLookups();
        departmentsLookups.value = res.data as Lookups[];
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
    departmentsLookups,
    getGroupLookups,
    getBranchLookups,
    getEntityLookups,
    getRolesLookups,
    getScreenLookups,
    getDepartmentsLookups,
  };
}
