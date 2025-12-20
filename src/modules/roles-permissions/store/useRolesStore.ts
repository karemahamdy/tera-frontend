import { defineStore } from "pinia";
import { ref } from "vue";
import type { Pagination, RoleListItem, RolePayload } from "../types/roles";
import { RoleService } from "../services/roles.service";

export const useRolesStore = defineStore("roles", () => {
  // -----------------------------
  // STATE
  // -----------------------------
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
      console.log(res);
      
      list.value = res.data;
      pagination.value.total = res.total;
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

  const sort = async (orderBy: string, direction: "asc" | "desc") => {
    pagination.value["PagenationDto.OrderBy"] = orderBy;
    pagination.value["PagenationDto.OrderDirection"] = direction;
    pagination.value["PagenationDto.PageIndex"] = 1;
    await getList();
  };

  const createItem = async (payload: RolePayload) => {
    try {
      loading.value = true;
      await RoleService.create(payload);
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (id: string, payload: RolePayload) => {
    try {
      loading.value = true;
      await RoleService.update(id, payload);
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
