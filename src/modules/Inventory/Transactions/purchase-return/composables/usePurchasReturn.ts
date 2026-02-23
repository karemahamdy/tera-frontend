import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PurchaseReturn } from "../types/PurchaseReturn";
import { PurchaseReturnService } from "../services/PurchaseReturn.service"

const loading = ref(false);
const apiPurchaseReturn = ref<PurchaseReturn[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref<string | null>(null);;
const orderDirection = ref<'asc' | 'desc'>('desc');

export function usePurchaseReturn() {
  const { t } = useI18n();

  const fetchPurchaseReturn = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await PurchaseReturnService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value 
      });
      const payload = response && response.data ? response.data : response;
      apiPurchaseReturn.value = payload.items ?? [];
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

  const fetchPurchaseReturnById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await PurchaseReturnService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createSalesReturn = async (payload: any) => {
    loading.value = true;
    try {
      const response = await PurchaseReturnService.create(payload);
      toastService.success(t("SalesReturn.SalesReturnCreatedSuccessfully"));
      await fetchPurchaseReturn(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSalesReturn = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await PurchaseReturnService.update(id, payload);
      toastService.success(t("SalesReturn.SalesReturnUpdatedSuccessfully"));
      await fetchPurchaseReturn(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSalesReturn = async (id: string) => {
    loading.value = true;
    try {
      await PurchaseReturnService.delete(id);
      toastService.success((t("SalesReturn.SalesReturnDeletedSuccessfully")));
      await fetchPurchaseReturn(pageIndex.value);
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
    fetchPurchaseReturn(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchPurchaseReturn(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchPurchaseReturn(1);
  }

  return {
    loading,
    apiPurchaseReturn,
    tableData,
    fetchPurchaseReturn,
    fetchPurchaseReturnById,
    createSalesReturn,
    updateSalesReturn,
    deleteSalesReturn,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchPurchaseReturn(p),
    onSearch,
    onFilterChange,
    onSort
  };
}