import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { ProductionReceiptsService } from "../services/ProductionReceipts.service";
import type { ProductionReceipts } from "../types/ProductionReceipts";

export function useProductionReceipts() {
  const loading = ref(false);
const apiProductionReceipts = ref<ProductionReceipts[]>([]);
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

  const fetchProductionReceipts = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await ProductionReceiptsService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiProductionReceipts.value = payload.items ?? [];
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

  const fetchProductionReceiptsById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await ProductionReceiptsService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createProductionReceipts = async (payload: any) => {
    loading.value = true;
    try {
      const response = await ProductionReceiptsService.create(payload);
      toastService.success(t("ProductionReceipts.ProductionReceiptsCreatedSuccessfully"));
      await fetchProductionReceipts(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateProductionReceipts = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await ProductionReceiptsService.update(id, payload);
      toastService.success(t("ProductionReceipts.ProductionReceiptsUpdatedSuccessfully"));
      await fetchProductionReceipts(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteProductionReceipts = async (id: string) => {
    loading.value = true;
    try {
      await ProductionReceiptsService.delete(id);
      toastService.success((t("ProductionReceipts.ProductionReceiptsDeletedSuccessfully")));
      apiProductionReceipts.value = apiProductionReceipts.value.filter((b) => b.id !== id);
      fetchProductionReceipts(pageIndex.value)
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
      await ProductionReceiptsService.toggleActive(id, isActive);
      toastService.success((t("ProductionReceipts.ProductionReceiptsUpdatedSuccessfully")));
      await fetchProductionReceipts(pageIndex.value);
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
    fetchProductionReceipts(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchProductionReceipts(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchProductionReceipts(1);
  }

  return {
    loading,
    apiProductionReceipts,
    tableData,
    fetchProductionReceipts,
    fetchProductionReceiptsById,
    createProductionReceipts,
    updateProductionReceipts,
    deleteProductionReceipts,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchProductionReceipts(p),
    onSearch,
    onFilterChange,
    onSort
  };
}