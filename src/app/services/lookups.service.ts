import axiosWrapper from "@/app/http/axiosWrapper";
import type { Lookups } from "../types/lookups";

export const LookupsService = {
  getGroupLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/GroupLookups");
  },
  getBranchLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/BranchLookups");
  },
  getEntityLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/EntityLookups");
  },
  getRolesLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/RolesLookups");
  },
  getScreenLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/ScreenLookups");
  },
  getDepartmentsLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/{ data: Lookups[] }/DepartmentsLookups");
  },
};
