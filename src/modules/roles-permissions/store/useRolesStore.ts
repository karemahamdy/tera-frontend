import { defineStore } from "pinia";
import { ref } from "vue";
import type { Pagination, RoleListItem, RolePayload } from "../types/roles";
import { RoleService } from "../services/roles.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export const useRolesStore = defineStore("roles", () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const { t } = useI18n();
  const list = ref<RoleListItem[]>([]);
  const loading = ref(false);

  const pagination = ref<Pagination>({
    "PagenationDto.PageIndex": 1,
    "PagenationDto.PageSize": 10,
    "PagenationDto.SearchingWord": "",
    "PagenationDto.OrderBy": "",
    "PagenationDto.OrderDirection": "asc",
    total: 0,
  });

  // -----------------------------
  // ACTIONS
  // -----------------------------
  const getList = async () => {
    loading.value = true;
    try {
      const res = await RoleService.getList(pagination.value);
      list.value = res.data.items;
      pagination.value.total = res.data.totalCount;
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const changePage = async (page: number) => {
    pagination.value["PagenationDto.PageIndex"] = page;
    await getList();
  };

  const search = async (keyword: string) => {
    pagination.value["PagenationDto.SearchingWord"] = keyword;
    pagination.value["PagenationDto.PageIndex"] = 1;
    await getList();
  };

  const sort = async (orderData: { orderBy: string, direction: "asc" | "desc" } ) => {
    pagination.value["PagenationDto.OrderBy"] = orderData.orderBy;
    pagination.value["PagenationDto.OrderDirection"] = orderData.direction;
    pagination.value["PagenationDto.PageIndex"] = 1;
    await getList();
  };

  const createItem = async (payload: RolePayload) => {
    try {
      loading.value = true;
      await RoleService.create(payload);
      toastService.success(t("roles.roleAdded"))
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (id: string, payload: RolePayload) => {
    try {
      loading.value = true;
      await RoleService.update(id, payload);
      toastService.success(t("roles.roleUpdated"))
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      loading.value = true;
      await RoleService.delete(id);
      list.value = list.value.filter((item) => item.id !== id);
      pagination.value.total--;
      toastService.success(t("roles.roleDeleted"))
      await getList();
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  return {
    // state
    list,
    loading,
    pagination,

    // actions
    getList,
    changePage,
    search,
    sort,
    createItem,
    updateItem,
    deleteItem,
  };
});
