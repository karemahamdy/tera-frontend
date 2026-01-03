import axiosWrapper from "@/app/http/axiosWrapper";
import type { Lookups } from "../types/lookups";

export const LookupsService = {
  getGroupLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/GroupLookups");
  },
  getBranchLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/BranchLookups");
  },
  getEntityLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/EntityLookups");
  },
  getRolesLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/RolesLookups");
  },
  getScreenLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/ScreenLookups");
  },
  getDepartmentsLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/DepartmentsLookups");
  },
};
