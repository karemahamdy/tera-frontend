import { ref } from "vue";
import router from "@/app/router";
import type { Pagination, UserListItem, UserPayload, PasswordResetForm, UserByID } from "../types/User";
import { UserService } from "../services/user.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export function useUsers() {
  const { t } = useI18n();

  const list = ref<UserListItem[]>([]);
  const userData = ref<UserByID>({} as UserByID);

  const loading = ref(false);

  const pagination = ref<Pagination>({
    GroupFilter: undefined,
    StatusFilter: undefined,
    ScopeFilter: undefined,
    DepartmentFilter: undefined,
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
    pagination.value.OrderBy = orderData.orderBy === "group" ? "usergroup" : orderData.orderBy;
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

  const changeUserStatus = async (id: string, isActive: boolean) => {
    loading.value = true;
    try {
      await UserService.changeStatus(id, isActive);
      toastService.success(t("users.userStatusUpdated"));
      await getList();
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (data: UserPayload) => {
    try {
      loading.value = true;
      await UserService.create(data);
      toastService.success(t("users.userAdded"));
      router.replace({ name: "UserManagement" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  }

  const editUser = async (id: string, data: UserPayload) => {
    try {
      loading.value = true;
      await UserService.update(id, data);
      toastService.success(t("users.userUpdated"));
      router.replace({ name: "UserManagement" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  }

  const getUserById = async (id: string) => {
    loading.value = true;
    try {
      const res = await UserService.getById(id);
      userData.value = res.data;
    } catch (error) {
      toastService.error(error as string);
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
    if (field === "userGroup") {
      pagination.value.GroupFilter = value;
    } else if (field === "status") {
      pagination.value.StatusFilter = value;
    } else if (field === "accessScope") {
      pagination.value.ScopeFilter = value;
    } else if (field === "department") {
      pagination.value.DepartmentFilter = value;
    }
    pagination.value.PageIndex = 1;
    getList();
  };

  const resetPassword = async (data: PasswordResetForm) => {
    try {
      loading.value = true;
      await UserService.resetPassword(data);
      toastService.success(t("users.passwordResetSuccess"));
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  return {
    list,
    userData,
    loading,
    pagination,
    getList,
    changePage,
    search,
    sort,
    deleteItem,
    onFilterChange,
    changeUserStatus,
    createUser,
    resetPassword,
    editUser,
    getUserById
  };
}
