import { ref, watch, computed } from "vue";
import { GroupService } from "../../user-group/services/group.service";
import type {
  GroupApiItem,
  GroupTableItem,
  AddGroup,
} from "../../user-group/types/groups";
import { toastService } from "../../../app/services/toastService";
import { useI18n } from "vue-i18n";

export function useGroups() {
  const { t } = useI18n();

  const loading = ref(false);
  const apiGroups = ref<GroupApiItem[]>([]);
  const tableData = ref<GroupTableItem[]>([]);

  const lastError = ref<string | null>(null);
  const validationErrors = ref<Record<string, string[]>>({});

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const orderDirection = ref<"asc" | "desc">("asc");

  const fetchGroups = async (page = 1) => {
    loading.value = true;
    lastError.value = null;
    try {
      const response: any = await GroupService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
      });
      const payload = response && response.data ? response.data : response;
      apiGroups.value = payload.items ?? [];
      pageIndex.value = payload.pageIndex ?? page;
      pageSize.value = payload.pageSize ?? pageSize.value;
      totalCount.value = payload.totalCount ?? 0;
      totalPages.value = payload.totalPages ?? 1;
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchGroupById = async (id: string): Promise<GroupApiItem | null> => {
    loading.value = true;
    validationErrors.value = {};
    try {
      const group = await GroupService.getById(id);
      return group;
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      await GroupService.toggleActive(id, isActive);
      const row = tableData.value.find((row) => row.id === id);
      if (row) row.isActive = isActive;
      toastService.success(t("userGroup.userGroupUpdated"));
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  watch(
    apiGroups,
    (groups) => {
      tableData.value = groups.map((group) => ({
        id: group.id,
        GroupName: group.name,
        Description: group.description ?? "-",
        AssignedRoles: group.rolesAssingedToGroup.length
          ? group.rolesAssingedToGroup.map((group) => group.name)
          : "-",
        userAssigned: group.userAssigned,
        createAt: group.createAt,
        isActive: group.isActive,
      }));
    },
    { immediate: true }
  );

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchGroups(1);
  };
  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchGroups(pageIndex.value);
  };
  const filteredTableData = computed(() =>
    tableData.value.map((row) => ({ ...row }))
  );

  const createGroup = async (payload: AddGroup) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      const response = await GroupService.create(payload);
      toastService.success(t("userGroup.userGroupCreated"));
      await fetchGroups();
      return response;
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateGroup = async (id: string, payload: AddGroup) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      const response = await GroupService.update(id, payload);
      toastService.success(t("userGroup.userGroupUpdated"));
      await fetchGroups();
      return response;
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGroup = async (id: string) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      await GroupService.delete(id);
      toastService.success(t("userGroup.userGroupDeleted"));
      apiGroups.value = apiGroups.value.filter((group) => group.id !== id);
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const clearErrors = () => {
    validationErrors.value = {};
    lastError.value = null;
  };

  return {
    loading,
    fetchGroups,
    fetchGroupById,
    filteredTableData,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    clearErrors,
    validationErrors,
    lastError,
    onSearch,
    onSort,
    setPage: (page: number) => fetchGroups(page),
  };
}
