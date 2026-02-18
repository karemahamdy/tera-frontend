import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { itemListService } from "../services/itemList.service";
import type { ItemCards, itemList, statistics } from "../types/itemList";
import { FileService } from "@/app/services/file.service";

export function useItem() {
 const loading = ref(false);
const apiItem = ref<itemList[]>([]);
const statistics = ref<statistics>({} as statistics);
const itemCards = ref<ItemCards>({} as ItemCards)

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref("");
const orderBy = ref("");
const StatusFilter = ref("");
const ItemGroupIds = ref<string[]>([]);
const WarehouseIds = ref<string[]>([]);
const orderDirection = ref<"asc" | "desc">("desc");
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
        ItemGroupIds: ItemGroupIds.value,
        WarehouseIds: WarehouseIds.value
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
      toastService.success(t("itemList.ItemCreatedSuccessfully"));
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
      toastService.success(t("itemList.ItemUpdatedSuccessfully"));
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
      toastService.success(t("itemList.ItemDeletedSuccessfully"));
        await fetchItem(pageIndex.value);
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
      toastService.success(t("itemList.ItemUpdatedSuccessfully"));
      await fetchItem(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const importItem = async (file: File) => {
    try {
      await FileService.uploadFile(
        "item/ImportItems",
        {
          file: file,
        },
        "file"
      );
      toastService.success(t("itemList.ItemImportedSuccessfully"));
      fetchItem(1);
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const exportItem = async () => {
    try {
      const response = await itemListService.exportData({
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value,
        WarehouseIds: WarehouseIds.value,
        ItemGroupIds: ItemGroupIds.value

      });
      FileService.downloadBlob(response, "item-data.csv");
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
    if (field === "isActive") {
      StatusFilter.value = value;
    }
    if (field === "itemGroup") {
      ItemGroupIds.value = Array.isArray(value) ? value : [value];

    }
    if (field === "Warehouse") {
      WarehouseIds.value = Array.isArray(value) ? value : [value];
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


  const fetchItemOverview = async (id: string) => {
    loading.value = true;
    try {
      const resp = await itemListService.getItemOverview(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchItemTransactions = async (id: string, page = 1) => {
    loading.value = true;
    try {
      const resp = await itemListService.getItemTransactions(id, {
        pageIndex: page,
        pageSize: pageSize.value,
      });
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchItemStock = async (id: string) => {
    loading.value = true;
    try {
      const resp = await itemListService.getItemStock(id);

      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchItemPricing = async (id: string) => {
    loading.value = true;
    try {
      const resp = await itemListService.getItemPricing(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const fetchItemCards = async (id: string) => {
    loading.value = true;
    try {
      const resp: any = await itemListService.getItemCards(id);
      itemCards.value = resp || {};
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };


  return {
    loading,
    apiItem,
    statistics,
    itemCards,
    fetchItem,
    fetchItemById,
    fetchItemOverview,
    fetchItemTransactions,
    fetchItemStock,
    fetchItemPricing,
    fetchItemCards,
    createItem,
    updateItem,
    deleteItem,
    toggleActive,
    importItem,
    exportItem,
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
