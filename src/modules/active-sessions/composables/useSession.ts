import { ref } from "vue";
import { toastService } from "@/app/services/toastService";

import type { ActiveSession, Pagination } from "../types/activeSessionsList";
import { SessionService } from "../services/session.service";
import { useI18n } from "vue-i18n";

export function useSession() {

  const List = ref<ActiveSession[]>([]);
  const loading = ref(false);
    const { t } = useI18n();

  const pagination = ref<Pagination>({
    IpAddressFilter: undefined,
    StatusFilter: undefined,
    BranchFilter: undefined,
    PageIndex: 1,
    PageSize: 10,
    SearchingWord: undefined,
    OrderBy: undefined,
    OrderDirection: undefined,
    total: 0,
  });
const getList = async () => {
  loading.value = true;
  try {
    const res = await SessionService.getSessions(pagination.value);
    List.value = res.data.items.map((item: any) => ({
      ...item,
      isActive:
        typeof item.status === "boolean"
          ? item.status
          : item.status === "Active",
    }));
    pagination.value.total = res.data.totalCount;

  } catch (err: any) {
    toastService.error(err);
  } finally {
    loading.value = false;
  }
};
  const terminateSession = async (sessionId: string) => {
    try {
      await SessionService.forceLogout(sessionId);
      toastService.success(t('sessions.sessionUpdated'));
      await getList(); 
    } catch (err: any) {
      toastService.error(err);
    }
  };

  const onFilterChange = (filter: {
    filter: { field: string };
    value: string;
  }) => {
    const field = filter.filter.field;
    const value = filter.value;
    if (field === "allIPAddress") {
      pagination.value.IpAddressFilter = value;
    } else if (field === "status") {
      pagination.value.StatusFilter = value;
    } else if (field === "allBranches") {
      pagination.value.BranchFilter = value;
    }
    pagination.value.PageIndex = 1;
    getList();
  };

  const changePage = async (page: number) => {
    pagination.value.PageIndex = page;
    await getList();
  };

  const search = async (keyword: string) => {
    pagination.value.SearchingWord = keyword;
    pagination.value.PageIndex = 1;
    await getList();
  };

  const sort = async (orderData: {
    orderBy: string;
    direction: "asc" | "desc";
  }) => {
    pagination.value.OrderBy = orderData.orderBy;
    pagination.value.OrderDirection = orderData.direction;
    pagination.value.PageIndex = 1;
    await getList();
  };

  return {
    List,
    loading,
    pagination,
    terminateSession,
    onFilterChange,
    getList,
    changePage,
    search,
    sort,
  };
}
