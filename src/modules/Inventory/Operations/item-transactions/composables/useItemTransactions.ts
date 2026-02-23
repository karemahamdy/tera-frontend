import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { ItemTransactions, MergeOrTransferTransactionsPayload } from "../types/ItemTransactions";
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
  
  const searchTerm = ref('');
  const orderBy = ref('');
  const typeFilter = ref('');
  const orderDirection = ref<'asc' | 'desc'>('desc');

  const fetchItemTransactions = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await ItemTransactionsService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        typeFilter: typeFilter.value
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


  const createItemTransactions = async (payload: MergeOrTransferTransactionsPayload) => {
    loading.value = true;
    try {
      await ItemTransactionsService.create(payload);
      toastService.success(t("ItemTransactions.ItemTransactionsCreatedSuccessfully"));
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
    createItemTransactions,
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