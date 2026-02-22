import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { InventoryAdjustment } from "../types/InventoryAdjustment";
import { InventoryAdjustmentService } from "../services/InventoryAdjustmentservice";

const loading = ref(false);
const apiInventoryAdjustment = ref<InventoryAdjustment[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useInventoryAdjustment() {
  const { t } = useI18n();

  const fetchInventoryAdjustment = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await InventoryAdjustmentService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        ReasonFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiInventoryAdjustment.value = payload.items ?? [];
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

  const fetchInventoryAdjustmentById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await InventoryAdjustmentService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createInventoryAdjustment = async (payload: any) => {
    loading.value = true;
    try {
      const response = await InventoryAdjustmentService.create(payload);
      toastService.success(t("InventoryAdjustment.InventoryAdjustmentCreatedSuccessfully"));
      await fetchInventoryAdjustment(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateInventoryAdjustment = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await InventoryAdjustmentService.update(id, payload);
      toastService.success(t("InventoryAdjustment.InventoryAdjustmentUpdatedSuccessfully"));
      await fetchInventoryAdjustment(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteInventoryAdjustment = async (id: string) => {
    loading.value = true;
    try {
      await InventoryAdjustmentService.delete(id);
      toastService.success((t("InventoryAdjustment.InventoryAdjustmentDeletedSuccessfully")));
      if(apiInventoryAdjustment.value.length === 1 && pageIndex.value > 1) {
        fetchInventoryAdjustment(pageIndex.value - 1)
      } else {
        fetchInventoryAdjustment(pageIndex.value)
      }
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
      await InventoryAdjustmentService.toggleActive(id, isActive);
      toastService.success((t("InventoryAdjustment.InventoryAdjustmentUpdatedSuccessfully")));
      await fetchInventoryAdjustment(pageIndex.value);
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
    fetchInventoryAdjustment(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchInventoryAdjustment(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchInventoryAdjustment(1);
  }

  return {
    loading,
    apiInventoryAdjustment,
    tableData,
    fetchInventoryAdjustment,
    fetchInventoryAdjustmentById,
    createInventoryAdjustment,
    updateInventoryAdjustment,
    deleteInventoryAdjustment,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchInventoryAdjustment(p),
    onSearch,
    onFilterChange,
    onSort
  };
}