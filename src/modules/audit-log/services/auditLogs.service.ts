import axiosWrapper from "@/app/http/axiosWrapper";
import type { AuditFiltersPayload, Pagination } from "../types/auditLogList";

export const AuditService = {
  async getAll(params: Pagination & { FromDate?: string; ToDate?: string }) {
    const resp = await axiosWrapper.get<any>(
      "/audit-logs/GetAll",
      { params }
    );
    return resp;
  },

  async filterLogs(
    filters: AuditFiltersPayload,
    params: Pagination & { FromDate?: string; ToDate?: string }
  ) {
    const resp = await axiosWrapper.post<any>(
      "/audit-logs/GetAllAudits",
      filters,
      { params }
    );
    return resp;
  },
};
