import axiosWrapper from "@/app/http/axiosWrapper";

export const LookupsService = {
async getRolesLookups() {
    const resp = await axiosWrapper.get<{ data: any }>('/Lookups/RolesLookups');
    return resp.data; 
  },
  async getBranchLookups() {
    const resp = await axiosWrapper.get<{ data: any }>('/Lookups/BranchLookups');
    return resp.data; 
  },
   async getGroupLookups() {
    const resp = await axiosWrapper.get<{ data: any }>('/Lookups/GroupLookups');
    return resp.data; 
  },
};
