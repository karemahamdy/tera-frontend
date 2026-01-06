import axiosWrapper from "@/app/http/axiosWrapper";
import type { IPLookups, Lookups } from "../types/lookups";

export const LookupsService = {
  getGroupLookups(isActive: boolean = true) {
    return axiosWrapper.get<{ data: Lookups[] }>(`/Lookups/GroupLookups?isActive=${isActive}`);
  },
  getBranchLookups(isActive: boolean = true) {
    return axiosWrapper.get<{ data: Lookups[] }>(`/Lookups/BranchLookups?isActive=${isActive}`);
  },
  getEntityLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/EntityLookups");
  },
  getRolesLookups(isActive: boolean = true) {
    return axiosWrapper.get<{ data: Lookups[] }>(`/Lookups/RolesLookups?isActive=${isActive}`);
  },
  getScreenLookups() {
    return axiosWrapper.get<{ data: Lookups[] }>("/Lookups/ScreenLookups");
  },
   getIPLookups() {
    return axiosWrapper.get<{ data: IPLookups[] }>("/Lookups/IpAddress-Lookup");
  },
  getDepartmentsLookups(isActive: boolean = true) {
    return axiosWrapper.get<{ data: Lookups[] }>(`/Lookups/DepartmentsLookups?isActive=${isActive}`);
  },
  
};
