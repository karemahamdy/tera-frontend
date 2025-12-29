import { ref } from "vue";
// import router from "@/app/router";

import type { Pagination, UserListItem } from "../types/User";
import { UserService } from "../services/user.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export function useUsers() {
  const { t } = useI18n();

  const list = ref<UserListItem[]>([]);

  const loading = ref(false);

  const pagination = ref<Pagination>({
    GroupFilter: undefined,
    StatusFilter: undefined,
    ScopeFilter: undefined,
    DepartmantFilter: undefined,
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
      const res = await UserService.getList(pagination.value);
      list.value = res.data.items;
      pagination.value.total = res.data.totalCount;
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
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

  const deleteItem = async (id: string) => {
    loading.value = true;
    try {
      await UserService.delete(id);
      list.value = list.value.filter((item) => item.userId !== id);
      pagination.value.total--;
      toastService.success(t("users.userDeleted"));
      await getList();
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const onFilterChange = (filter: any) => {
  const field = filter.field;
  const value = filter.value;
  if (field === "userGroup") {
    pagination.value.GroupFilter = value;
  } else if (field === "status") {
    pagination.value.StatusFilter = value;
  } else if (field === "accessScope") {
    pagination.value.ScopeFilter = value;
  } else if (field === "department") {
    pagination.value.DepartmantFilter = value;
  }
  pagination.value.PageIndex = 1;
  getList();
};

  return {
    list,
    loading,
    pagination,
    getList,
    changePage,
    search,
    sort,
    deleteItem,
    onFilterChange
  };
}
