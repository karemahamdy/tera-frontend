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

  async exportLogs(
    params: Record<string, any>
  ) {
    const resp = await axiosWrapper.get<any>("/audit-logs/export", {
      params,
      responseType: "blob",
      paramsSerializer: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => queryParams.append(key, item));
          } else if (value !== undefined && value !== null) {
            queryParams.append(key, value as string);
          }
        });
        return queryParams.toString();
      },
    });
    return resp;
  },
};
