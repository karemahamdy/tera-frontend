import { ref, computed, watch, type Ref } from "vue";
import { toastService } from "@/app/services/toastService";
import { AuditService } from "../services/auditLogs.service";
import type { AuditLog, AuditFiltersPayload, Pagination } from "../types/auditLogList";
import { formatDate } from "@/app/utils/dates";

import { FileService } from "@/app/services/file.service";

interface FilterChangePayload {
  filter: { field: string };
  value: any;
}

export function useAudit() {
  const loading = ref(false);
  const List = ref<AuditLog[]>([]);
  const filters = ref<AuditFiltersPayload>({});

  const fromDate: Ref<Date | null> = ref(null);
  const toDate: Ref<Date | null> = ref(null);

  const pagination = ref<Pagination>({
    PageIndex: 1,
    PageSize: 10,
    SearchingWord: undefined,
    OrderBy: undefined,
    OrderDirection: "desc",
    total: 0,
  });

  const totalPages = ref<number>(1);

  const fetchAuditLogs = async () => {
    loading.value = true;
    try {
      const hasFilters = Object.values(filters.value).some(
        v => Array.isArray(v) && v.length > 0
      );

      const params = {
        ...pagination.value,
        FromDate: formatDate(fromDate.value),
        ToDate: formatDate(toDate.value),
      };

      const response = hasFilters
        ? await AuditService.filterLogs(filters.value, params)
        : await AuditService.getAll(params);

      List.value = response.items ?? [];
      pagination.value.PageIndex = response.pageIndex ?? 1;
      pagination.value.PageSize = response.pageSize ?? 10;
      pagination.value.total = response.totalCount ?? 0;
      totalPages.value = response.totalPages ?? 1;
    } catch (err: any) {
      toastService.error(err?.message || "Error fetching audit logs");
    } finally {
      loading.value = false;
    }
  };

  const onFilterChange = (payload: FilterChangePayload) => {
    const { field } = payload.filter;
    const value = payload.value ?? [];

    switch (field) {
      case "auditLog.user":
        filters.value.userIds = value;
        break;
      case "allBranches":
        filters.value.branchIds = value;
        break;
      case "auditLog.module":
        filters.value.moduleNames = value;
        break;
      case "screen":
        filters.value.screenNames = value;
        break;
    }

    pagination.value.PageIndex = 1;
    fetchAuditLogs();
  };

  const onDateChange = () => {
    pagination.value.PageIndex = 1;
    fetchAuditLogs();
  };

  watch([fromDate, toDate], onDateChange);

  const onSearch = (term: string) => {
    pagination.value.SearchingWord = term;
    pagination.value.PageIndex = 1;
    fetchAuditLogs();
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    pagination.value.OrderBy = orderByField;
    pagination.value.OrderDirection = direction;
    fetchAuditLogs();
  };

  const setPage = (page: number) => {
    pagination.value.PageIndex = page;
    fetchAuditLogs();
  };

  const exportAuditLogs = async () => {
    try {
      const params: any = {
        FromDate: formatDate(fromDate.value),
        ToDate: formatDate(toDate.value),
        ...filters.value,
        ...pagination.value,
      };

      // Remove undefined/null/empty values to keep url clean
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === null || params[key] === "") {
          delete params[key];
        }
      });

      const response = await AuditService.exportLogs(params);
      FileService.downloadBlob(response, "audit-logs.csv");
    } catch (err: any) {
      toastService.error(err?.message || "Error exporting audit logs");
    }
  };

  return {
    loading,
    List,
    pageIndex: computed(() => pagination.value.PageIndex),
    pageSize: computed(() => pagination.value.PageSize),
    totalCount: computed(() => pagination.value.total),
    totalPages,
    onFilterChange,
    onSearch,
    onSort,
    setPage,
    fetchAuditLogs,
    onDateChange,
    filters,
    fromDate,
    toDate,
    exportAuditLogs,
  };
}
