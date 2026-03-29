import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { workOrderService } from "../services/WorkOrder.service";
import type { workOrder } from "../types/WorkOrder";

export function useworkOrder() {
  const loading = ref(false);
const apiworkOrder = ref<workOrder[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

  const { t } = useI18n();

  const fetchworkOrder = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await workOrderService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiworkOrder.value = payload.items ?? [];
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

  const fetchworkOrderById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await workOrderService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createworkOrder = async (payload: any) => {
    loading.value = true;
    try {
      const response = await workOrderService.create(payload);
      toastService.success(t("workOrder.workOrderCreatedSuccessfully"));
      await fetchworkOrder(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateworkOrder = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await workOrderService.update(id, payload);
      toastService.success(t("workOrder.workOrderUpdatedSuccessfully"));
      await fetchworkOrder(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteworkOrder = async (id: string) => {
    loading.value = true;
    try {
      await workOrderService.delete(id);
      toastService.success((t("workOrder.workOrderDeletedSuccessfully")));
      apiworkOrder.value = apiworkOrder.value.filter((b) => b.id !== id);
      fetchworkOrder(pageIndex.value)
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
      await workOrderService.toggleActive(id, isActive);
      toastService.success((t("workOrder.workOrderUpdatedSuccessfully")));
      await fetchworkOrder(pageIndex.value);
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
    fetchworkOrder(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchworkOrder(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchworkOrder(1);
  }

  return {
    loading,
    apiworkOrder,
    tableData,
    fetchworkOrder,
    fetchworkOrderById,
    createworkOrder,
    updateworkOrder,
    deleteworkOrder,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchworkOrder(p),
    onSearch,
    onFilterChange,
    onSort
  };
}