import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PurchaseWaybill } from "../types/ItemTransactions";
import { PurchaseWaybillService } from "../services/ItemTransactions.service";

const loading = ref(false);
const apiPurchaseWaybill = ref<PurchaseWaybill[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function usePurchaseWaybill() {
  const { t } = useI18n();

  const fetchPurchaseWaybill = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await PurchaseWaybillService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiPurchaseWaybill.value = payload.items ?? [];
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

  const fetchPurchaseWaybillById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await PurchaseWaybillService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createPurchaseWaybill = async (payload: any) => {
    loading.value = true;
    try {
      const response = await PurchaseWaybillService.create(payload);
      toastService.success(t("PurchaseWaybill.PurchaseWaybillCreatedSuccessfully"));
      await fetchPurchaseWaybill(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePurchaseWaybill = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await PurchaseWaybillService.update(id, payload);
      toastService.success(t("PurchaseWaybill.PurchaseWaybillUpdatedSuccessfully"));
      await fetchPurchaseWaybill(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePurchaseWaybill = async (id: string) => {
    loading.value = true;
    try {
      await PurchaseWaybillService.delete(id);
      toastService.success((t("PurchaseWaybill.PurchaseWaybillDeletedSuccessfully")));
      apiPurchaseWaybill.value = apiPurchaseWaybill.value.filter((b) => b.id !== id);
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
      await PurchaseWaybillService.toggleActive(id, isActive);
      toastService.success((t("PurchaseWaybill.PurchaseWaybillUpdatedSuccessfully")));
      await fetchPurchaseWaybill(pageIndex.value);
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
    fetchPurchaseWaybill(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchPurchaseWaybill(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchPurchaseWaybill(1);
  }

  return {
    loading,
    apiPurchaseWaybill,
    tableData,
    fetchPurchaseWaybill,
    fetchPurchaseWaybillById,
    createPurchaseWaybill,
    updatePurchaseWaybill,
    deletePurchaseWaybill,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchPurchaseWaybill(p),
    onSearch,
    onFilterChange,
    onSort
  };
}