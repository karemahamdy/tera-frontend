
import { ref, computed, watch } from "vue";
import { toastService } from "@/app/services/toastService";
import { AuditService } from "../services/auditLogs.service";
import type { AuditLog, AuditFiltersPayload, Pagination } from "../types/auditLogList";

export function useAudit() {
  const loading = ref(false);
  const List = ref<AuditLog[]>([]);
  const filters = ref<AuditFiltersPayload>({});
  const fromDate = ref<string | undefined>();
  const toDate = ref<string | undefined>();

  const pagination = ref<Pagination>({
    PageIndex: 1,
    PageSize: 10,
    SearchingWord: undefined,
    OrderBy: undefined,
    OrderDirection: "desc",
    total: 0,
  });

  const totalPages = ref(1);

  const fetchAuditLogs = async () => {
    loading.value = true;
    try {
      const hasFilters = Object.values(filters.value).some(
        v => Array.isArray(v) && v.length
      );

      const params = {
        ...pagination.value,
        FromDate: fromDate.value,
        ToDate: toDate.value,
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

  const onFilterChange = (payload: { filter: { field: string }; value: any }) => {
    const { field } = payload.filter;
    const value = payload.value;

    switch (field) {
      case "auditLog.user":
        filters.value.userIds = value ? value : [] ;
      break;
      case "allBranches":
        filters.value.branchIds = value ? value : [] ;
      break;
      case "auditLog.module":
        filters.value.moduleNames = value ? value : [];
      break;
      case "screen":
        filters.value.screenNames = value ? value : [] ;
      break;
      
    }

    pagination.value.PageIndex = 1;
    fetchAuditLogs();
  };

  watch([fromDate, toDate], () => {
    pagination.value.PageIndex = 1;
    fetchAuditLogs();
  });

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
    filters,
    fromDate,
    toDate,
  };
}
