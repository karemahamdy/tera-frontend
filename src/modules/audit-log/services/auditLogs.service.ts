import axiosWrapper from "@/app/http/axiosWrapper";
import type { Pagination } from "../types/auditLogList";

export const AuditService = {
  async getAll(params: Pagination) {
    const resp = await axiosWrapper.get<any>("/audit-logs/GetAll?", {params} );
    return resp;
  },

};
