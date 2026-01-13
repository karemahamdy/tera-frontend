import { ref } from "vue";
import { toastService } from "../../../app/services/toastService";
import { AuditService } from "../services/auditLogs.service";
import type { AuditLog } from "../types/auditLogList";
import type { Pagination } from "../types/auditLogList";

export function useAudit() {
  const loading = ref(false);
  const List = ref<AuditLog[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);
  const searchTerm = ref("");
  const orderBy = ref("");
  const orderDirection = ref<"asc" | "desc">("desc");

  const fetchAuditLogs = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await AuditService.getAll({
        PageIndex: page,
        PageSize: pageSize.value,
        SearchingWord: searchTerm.value,
        OrderBy: orderBy.value,
        OrderDirection: orderDirection.value,
      } as Pagination);

      List.value = response.items ?? [];
      pageIndex.value = response.pageIndex ?? page;
      pageSize.value = response.pageSize ?? pageSize.value;
      totalCount.value = response.totalCount ?? 0;
      totalPages.value = response.totalPages ?? 1;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchAuditLogs(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchAuditLogs(pageIndex.value);
  };
 const onFilterChange = (filter: {
    filter: { field: string };
    value: string;
  }) => {
    const field = filter.filter.field;
    // const value = filter.value;
    if (field === "allIPAddress") {
      // pagination.value.IpAddressFilter = value;
    } else if (field === "status") {
      // pagination.value.StatusFilter = value;
    } else if (field === "allBranches") {
      // pagination.value.BranchFilter = value;
    }
    // pagination.value.PageIndex = 1;
    fetchAuditLogs();
    };
  
  return {
    loading,
    List,
    pageIndex,
    pageSize,
    totalCount,
    onFilterChange,
    totalPages,
    onSearch,
    onSort,
    setPage: (page: number) => fetchAuditLogs(page),
    fetchAuditLogs,
  };
}
