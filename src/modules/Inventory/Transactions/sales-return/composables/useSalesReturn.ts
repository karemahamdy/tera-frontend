import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { SalesReturn } from "../types/SalesReturn";
import { SalesReturnService } from "../services/SalesReturn.service";

const loading = ref(false);
const apiSalesReturn = ref<SalesReturn[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useSalesReturn() {
  const { t } = useI18n();

  const fetchSalesReturn = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await SalesReturnService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiSalesReturn.value = payload.items ?? [];
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

  const fetchSalesReturnById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await SalesReturnService.getById(id);
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
      const response = await SalesReturnService.create(payload);
      toastService.success(t("SalesReturn.SalesReturnCreatedSuccessfully"));
      await fetchSalesReturn(pageIndex.value);
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
      const response = await SalesReturnService.update(id, payload);
      toastService.success(t("SalesReturn.SalesReturnUpdatedSuccessfully"));
      await fetchSalesReturn(pageIndex.value);
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
      await SalesReturnService.delete(id);
      toastService.success((t("SalesReturn.SalesReturnDeletedSuccessfully")));
      apiSalesReturn.value = apiSalesReturn.value.filter((b) => b.id !== id);
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
      await SalesReturnService.toggleActive(id, isActive);
      toastService.success((t("SalesReturn.SalesReturnUpdatedSuccessfully")));
      await fetchSalesReturn(pageIndex.value);
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
    fetchSalesReturn(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchSalesReturn(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchSalesReturn(1);
  }

  return {
    loading,
    apiSalesReturn,
    tableData,
    fetchSalesReturn,
    fetchSalesReturnById,
    createSalesReturn,
    updateSalesReturn,
    deleteSalesReturn,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchSalesReturn(p),
    onSearch,
    onFilterChange,
    onSort
  };
}