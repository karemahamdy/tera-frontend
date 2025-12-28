import { ref } from "vue";
import router from "@/app/router";

import type {
  Pagination,
  RoleListItem,
  RoleByID,
  Permission,
} from "../types/roles";
import { RoleService } from "../services/roles.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export function useRoles() {
  const { t } = useI18n();

  const list = ref<RoleListItem[]>([]);
  const role = ref<RoleByID>({
    name: "",
    description: "",
    treeOfPermissions: [],
  });

  const loading = ref(false);

  const pagination = ref<Pagination>({
    "PagenationDto.PageIndex": 1,
    "PagenationDto.PageSize": 10,
    "PagenationDto.SearchingWord": "",
    "PagenationDto.OrderBy": "",
    "PagenationDto.OrderDirection": "asc",
    total: 0,
  });

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

  const sort = async (orderData: {
    orderBy: string;
    direction: "asc" | "desc";
  }) => {
    pagination.value["PagenationDto.OrderBy"] = orderData.orderBy;
    pagination.value["PagenationDto.OrderDirection"] = orderData.direction;
    pagination.value["PagenationDto.PageIndex"] = 1;
    await getList();
  };

  const createItem = async (payload: RoleByID) => {
    loading.value = true;
    try {
      await RoleService.create(payload);
      toastService.success(t("roles.roleAdded"));
      router.replace({ name: "RolesPermissions" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (id: string, payload: RoleByID) => {
    loading.value = true;
    try {
      await RoleService.update(id, payload);
      toastService.success(t("roles.roleUpdated"));
      router.replace({ name: "RolesPermissions" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };
  const getAllModulesStatus = (data: Permission[]): Permission[] => {
    data = data.map((permission) => {
      const dtos = permission.permissionDtos;
      return {
        ...permission,
        isCreate: dtos.every((d) => d.isCreate),
        isUpdate: dtos.every((d) => d.isUpdate),
        isDelete: dtos.every((d) => d.isDelete),
        isView: dtos.every((d) => d.isView),
      };
    });
    return data;
  };
  const getItemById = async (id: string) => {
    loading.value = true;
    try {
      const res = await RoleService.getById(id);
      res.data.treeOfPermissions = getAllModulesStatus(res.data.treeOfPermissions);
      role.value = res.data;
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (id: string) => {
    loading.value = true;
    try {
      await RoleService.delete(id);
      list.value = list.value.filter((item) => item.id !== id);
      pagination.value.total--;
      toastService.success(t("roles.roleDeleted"));
      await getList();
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const getModuleslistData = async () => {
    loading.value = true;
    try {
      const response = await RoleService.getModuleslist();
      role.value.treeOfPermissions = getAllModulesStatus(response);
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  return {
    // state
    list,
    role,
    loading,
    pagination,

    // actions
    getList,
    changePage,
    search,
    sort,
    createItem,
    updateItem,
    getItemById,
    deleteItem,
    getModuleslistData,
    getAllModulesStatus
  };
}
