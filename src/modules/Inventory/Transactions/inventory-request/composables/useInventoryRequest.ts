import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { InventoryRequest } from "../types/InventoryRequest";
import { InventoryRequestService } from "../services/InventoryRequest.service";

const loading = ref(false);
const apiInventoryRequest = ref<InventoryRequest[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const TransactionType = ref<string | null>(null);
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useInventoryRequest() {
  const { t } = useI18n();

  const fetchInventoryRequest = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await InventoryRequestService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        TransactionType: TransactionType.value as string | null,
      });
      const payload = response && response.data ? response.data : response;
      apiInventoryRequest.value = payload.items ?? [];
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

  const fetchInventoryRequestById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await InventoryRequestService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createInventoryRequest = async (payload: any) => {
    loading.value = true;
    try {
      const response = await InventoryRequestService.create(payload);
      toastService.success(t("inventoryRequest.InventoryRequestCreatedSuccessfully"));
      await fetchInventoryRequest(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateInventoryRequest = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await InventoryRequestService.update(id, payload);
      toastService.success(t("inventoryRequest.InventoryRequestUpdatedSuccessfully"));
      await fetchInventoryRequest(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteInventoryRequest = async (id: string) => {
    loading.value = true;
    try {
      await InventoryRequestService.delete(id);
      toastService.success((t("inventoryRequest.InventoryRequestDeletedSuccessfully")));
      apiInventoryRequest.value = apiInventoryRequest.value.filter((b) => b.id !== id);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

 const fetchNextNumber = async () => {
      loading.value = true;
      try {
        const resp = await InventoryRequestService.getNextNumber();
        return resp;
      } catch (err: any) {
        toastService.error(err);
        return null;
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
      TransactionType.value = value;
    }
    fetchInventoryRequest(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchInventoryRequest(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchInventoryRequest(1);
  }

  return {
    loading,
    apiInventoryRequest,
    tableData,
    fetchInventoryRequest,
    fetchInventoryRequestById,
    createInventoryRequest,
    updateInventoryRequest,
    deleteInventoryRequest,
    fetchNextNumber,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchInventoryRequest(p),
    onSearch,
    onFilterChange,
    onSort
  };
}