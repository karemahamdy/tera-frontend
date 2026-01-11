import axiosWrapper from "@/app/http/axiosWrapper";
import type { pageParams } from "@/modules/user-group/types/groups";


export const AuditService = {
  async getAll(params: pageParams) {
    const resp = await axiosWrapper.get<any>("/audit-logs/GetAll?", {params} );
    return resp;
  },

};
