import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { ItemTransactions } from "../types/ItemTransactions";
import { ItemTransactionsService } from "../services/ItemTransactions.service";

const loading = ref(false);
const apiItemTransactions = ref<ItemTransactions[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useItemTransactions() {
  const { t } = useI18n();

  const fetchItemTransactions = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await ItemTransactionsService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
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

  const fetchItemTransactionsById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await ItemTransactionsService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createItemTransactions = async (payload: any) => {
    loading.value = true;
    try {
      const response = await ItemTransactionsService.create(payload);
      toastService.success(t("ItemTransactions.ItemTransactionsCreatedSuccessfully"));
      await fetchItemTransactions(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateItemTransactions = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await ItemTransactionsService.update(id, payload);
      toastService.success(t("ItemTransactions.ItemTransactionsUpdatedSuccessfully"));
      await fetchItemTransactions(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteItemTransactions = async (id: string) => {
    loading.value = true;
    try {
      await ItemTransactionsService.delete(id);
      toastService.success((t("ItemTransactions.ItemTransactionsDeletedSuccessfully")));
      apiItemTransactions.value = apiItemTransactions.value.filter((b) => b.id !== id);
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
      await ItemTransactionsService.toggleActive(id, isActive);
      toastService.success((t("ItemTransactions.ItemTransactionsUpdatedSuccessfully")));
      await fetchItemTransactions(pageIndex.value);
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
    fetchItemTransactions(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchItemTransactions(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchItemTransactions(1);
  }

  return {
    loading,
    apiItemTransactions,
    tableData,
    fetchItemTransactions,
    fetchItemTransactionsById,
    createItemTransactions,
    updateItemTransactions,
    deleteItemTransactions,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchItemTransactions(p),
    onSearch,
    onFilterChange,
    onSort
  };
}