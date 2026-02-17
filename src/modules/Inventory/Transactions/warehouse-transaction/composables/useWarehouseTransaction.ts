import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { WarehouseTransaction } from "../types/WarehouseTransaction";
import { WarehouseTransactionService } from "../services/WarehouseTransaction";

const loading = ref(false);
const apiWarehouseTransaction = ref<WarehouseTransaction[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useWarehouseTransaction() {
  const { t } = useI18n();

  const fetchWarehouseTransaction = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await WarehouseTransactionService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response;
      console.log(payload);

      apiWarehouseTransaction.value = payload.items ?? [];
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

  const fetchWarehouseTransactionById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await WarehouseTransactionService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createWarehouseTransaction = async (payload: any) => {
    loading.value = true;
    try {
      const response = await WarehouseTransactionService.create(payload);
      toastService.success(t("WarehouseTransaction.WarehouseTransactionCreatedSuccessfully"));
      await fetchWarehouseTransaction(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateWarehouseTransaction = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await WarehouseTransactionService.update(id, payload);
      toastService.success(t("WarehouseTransaction.WarehouseTransactionUpdatedSuccessfully"));
      await fetchWarehouseTransaction(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteWarehouseTransaction = async (id: string) => {
    loading.value = true;
    try {
      await WarehouseTransactionService.delete(id);
      toastService.success((t("WarehouseTransaction.WarehouseTransactionDeletedSuccessfully")));
      await fetchWarehouseTransaction(pageIndex.value);
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
    fetchWarehouseTransaction(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchWarehouseTransaction(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchWarehouseTransaction(1);
  }

  return {
    loading,
    apiWarehouseTransaction,
    tableData,
    fetchWarehouseTransaction,
    fetchWarehouseTransactionById,
    createWarehouseTransaction,
    updateWarehouseTransaction,
    deleteWarehouseTransaction,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchWarehouseTransaction(p),
    onSearch,
    onFilterChange,
    onSort
  };
}