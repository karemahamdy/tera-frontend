import { ref } from "vue";
import { toastService } from "@/app/services/toastService";

import type { ActiveSession, Pagination } from "../types/activeSessionsList";
import { SessionService } from "../services/session.service";

export function useSession() {

  const List = ref<ActiveSession[]>([]);
  const loading = ref(false);

  const pagination = ref<Pagination>({
    IpAddressFilter: undefined,
    StatusFilter: undefined,
    ScopeFilter: undefined,
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

    List.value = res.data.items;
    pagination.value.total = res.data.totalCount;

  } catch (error: any) {
    toastService.error(error?.message || "Error loading sessions");
  } finally {
    loading.value = false;
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
    onFilterChange,
    getList,
    changePage,
    search,
    sort,
  };
}
