import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/app/router";
import type {
  ItemTransactions,
  MergeOrTransferTransactionsPayload,
  ItemInfo,
} from "../types/ItemTransactions";
import { ItemTransactionsService } from "../services/ItemTransactions.service";

export function useItemTransactions() {
  const { t } = useI18n();
  const loading = ref(false);
  const apiItemTransactions = ref<ItemTransactions[]>([]);
  const tableData = ref<any[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const typeFilter = ref("");
  const orderDirection = ref<"asc" | "desc">("desc");

  const fetchItemTransactions = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await ItemTransactionsService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        typeFilter: typeFilter.value,
      });
      const payload = response && response.data ? response.data : response;
      apiItemTransactions.value = payload.items ?? [];
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

  const createItemTransactions = async (
    payload: MergeOrTransferTransactionsPayload,
  ) => {
    loading.value = true;
    try {
      await ItemTransactionsService.create(payload);
      toastService.success(
        t("ItemTransactions.ItemTransactionsCreatedSuccessfully"),
      );
      router.replace({ name: "ItemTransactions" });
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
    if (field === "typeFilter") {
      typeFilter.value = value;
    }
    fetchItemTransactions(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchItemTransactions(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchItemTransactions(1);
  };

  const getItemInformations = async (
    itemId: string,
    warehouseId?: string,
  ): Promise<ItemInfo> => {
    try {
      if (!itemId || itemId === "") {
        return {
          totalQuantity: 0,
          locations: 0,
          transaction: 0,
        };
      }
      const response: any = await ItemTransactionsService.getItemInformations({
        itemId,
        warehouseId:
          !warehouseId || warehouseId === "" ? undefined : warehouseId,
      });
      return {
        totalQuantity: response.totalQuantity ?? 0,
        locations: response.locations ?? 0,
        transaction: response.transaction ?? 0,
      };
    } catch (err: any) {
      toastService.error(err);
      return {
        totalQuantity: 0,
        locations: 0,
        transaction: 0,
      };
    }
  };

  return {
    loading,
    apiItemTransactions,
    tableData,
    fetchItemTransactions,
    createItemTransactions,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchItemTransactions(p),
    onSearch,
    onFilterChange,
    onSort,
    getItemInformations,
  };
}
