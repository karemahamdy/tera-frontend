import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type {
  ItemHold,
  ReleaseItemPayload,
  ItemHoldPayload,
} from "../types/ItemHold";
import { ItemHoldService } from "../services/ItemHold.service";
import router from "@/app/router";

export function useItemHold() {
  const { t } = useI18n();
  const loading = ref(false);
  const apiItemHold = ref<ItemHold[]>([]);
  const tableData = ref<any[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const StatusFilter = ref<string | null>(null);
  const orderDirection = ref<"asc" | "desc">("desc");

  const fetchItemHold = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await ItemHoldService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        itemTypeHoldFilter: StatusFilter.value,
      });
      const payload = response && response.data ? response.data : response;
      apiItemHold.value = payload.items ?? [];
      pageIndex.value = payload.pageIndex ?? page;
      pageSize.value = payload.pageSize ?? pageSize.value;
      totalCount.value = payload.totalCount ?? 0;
      totalPages.value = payload.totalPages ?? 1;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchItemHoldById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await ItemHoldService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createItemHold = async (payload: ItemHoldPayload) => {
    loading.value = true;
    try {
      await ItemHoldService.create(payload);
      toastService.success(t("ItemHold.ItemHoldCreatedSuccessfully"));
      await fetchItemHold(pageIndex.value);
      router.replace({ name: "ItemHold" });
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateItemHold = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await ItemHoldService.update(id, payload);
      toastService.success(t("ItemHold.ItemHoldUpdatedSuccessfully"));
      await fetchItemHold(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteItemHold = async (id: string) => {
    loading.value = true;
    try {
      await ItemHoldService.delete(id);
      toastService.success(t("ItemHold.ItemHoldDeletedSuccessfully"));
      apiItemHold.value = apiItemHold.value.filter((b) => b.id !== id);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const releaseItem = async (data: ReleaseItemPayload) => {
    loading.value = true;
    try {
      await ItemHoldService.releaseItem(data);
      toastService.success(t("ItemHold.itemReleasedSuccessfully"));
      if (apiItemHold.value.length === 1 && pageIndex.value > 1) {
        await fetchItemHold(pageIndex.value - 1);
      } else {
        await fetchItemHold(pageIndex.value);
      }
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    loading.value = true;
    try {
      await ItemHoldService.toggleActive(id, isActive);
      toastService.success(t("ItemHold.ItemHoldUpdatedSuccessfully"));
      await fetchItemHold(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
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
    if (field === "type") {
      StatusFilter.value = value;
    }
    fetchItemHold(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchItemHold(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchItemHold(1);
  };

  return {
    loading,
    apiItemHold,
    tableData,
    fetchItemHold,
    fetchItemHoldById,
    createItemHold,
    updateItemHold,
    deleteItemHold,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchItemHold(p),
    onSearch,
    onFilterChange,
    onSort,
    releaseItem,
  };
}
