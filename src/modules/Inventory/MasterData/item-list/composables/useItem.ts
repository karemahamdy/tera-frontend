import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { itemListService } from "../services/itemList.service";
import type { itemList } from "../types/itemList";

const loading = ref(false);
const apiItem = ref<itemList[]>([]);
const statistics = ref<itemList[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref("");
const orderBy = ref("");
const StatusFilter = ref("");
const orderDirection = ref<"asc" | "desc">("desc");

export function useItem() {
  const { t } = useI18n();

  const fetchItem = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await itemListService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value,
      });
      const payload = response?.data ?? response;
      const inventory = payload.inventoryItems;
      apiItem.value = inventory?.items ?? [];
      statistics.value = payload.statistics ?? {};
      pageIndex.value = inventory?.pageIndex ?? page;
      pageSize.value = inventory?.pageSize ?? pageSize.value;
      totalCount.value = inventory?.totalCount ?? 0;
      totalPages.value = inventory?.totalPages ?? 1;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const fetchItemById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await itemListService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createItem = async (payload: any) => {
    loading.value = true;
    try {
      const response = await itemListService.create(payload);
      toastService.success(t("Item.ItemCreatedSuccessfully"));
      await fetchItem(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateItem = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await itemListService.update(id, payload);
      toastService.success(t("Item.ItemUpdatedSuccessfully"));
      await fetchItem(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteItem = async (id: string) => {
    loading.value = true;
    try {
      await itemListService.delete(id);
      toastService.success(t("Item.ItemDeletedSuccessfully"));
      apiItem.value = apiItem.value.filter((b) => b.id !== id);
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
      await itemListService.toggleActive(id, isActive);
      toastService.success(`Item is now ${isActive ? "Active" : "in Active"}`);
      await fetchItem(pageIndex.value);
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
    if (field === "status") {
      StatusFilter.value = value;
    }
    fetchItem(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchItem(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchItem(1);
  };

  return {
    loading,
    apiItem,
    statistics,
    fetchItem,
    fetchItemById,
    createItem,
    updateItem,
    deleteItem,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchItem(p),
    onSearch,
    onFilterChange,
    onSort,
  };
}
