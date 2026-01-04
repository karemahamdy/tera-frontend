import { ref, computed } from "vue";
import { toastService } from "../../../app/services/toastService";
import { AuditService } from "../services/auditLogs.service";

export interface AuditLog {
  entityName: string;
  userName: string | null;
  branchNameAr: string | null;
  branchNameEn: string | null;
  actionType: number;
  moduleName: string;
  screenName: string;
  transactionNumber: string;
  timestamp: string;
}

export function useAudit() {
  const loading = ref(false);
  const apiAuditLogs = ref<AuditLog[]>([]);

  const tableData = computed(() =>
    apiAuditLogs.value.map((log) => ({
      Created: log.timestamp,
      user: log.userName ?? "-",
      action:
        log.actionType === 0
          ? "Create"
          : log.actionType === 1
          ? "Update"
          : log.actionType === 2
          ? "Delete"
          : log.actionType === 3
          ? "Assign"
          : "-",
      module: log.moduleName ?? "-",
      screen: log.screenName ?? "-",
      entity: log.entityName ?? "-",
      branch: log.branchNameAr ?? log.branchNameEn ?? "-",
      transactionID: log.transactionNumber ?? "-",
    }))
  );

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const orderDirection = ref<"asc" | "desc">("asc");

  const fetchAuditLogs = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await AuditService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
      });

apiAuditLogs.value = response.items ?? [];
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

  const filteredTableData = computed(() => tableData.value);

  return {
    loading,
    filteredTableData,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    onSearch,
    onSort,
    setPage: (page: number) => fetchAuditLogs(page),
    fetchAuditLogs,
  };
}
