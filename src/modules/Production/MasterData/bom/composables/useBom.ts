import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { BOMService } from "../services/BOM.service";
import type { BOM } from "../types/BOM";

export function useBOM() {
  const loading = ref(false);
const apiBOM = ref<BOM[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const ParentItemId = ref<string | null>(null);
const orderDirection = ref<'asc' | 'desc'>('desc');

  const { t } = useI18n();

  const fetchBOM = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await BOMService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value,
        ParentItemId: ParentItemId.value,
      });
      const payload = response && response.data ? response.data : response;
      apiBOM.value = payload.items ?? [];
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

  const fetchBOMById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await BOMService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createBOM = async (payload: any) => {
    loading.value = true;
    try {
      const response = await BOMService.create(payload);
      toastService.success(t("BOM.BOMCreatedSuccessfully"));
      await fetchBOM(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBOM = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await BOMService.update(id, payload);
      toastService.success(t("BOM.BOMUpdatedSuccessfully"));
      await fetchBOM(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBOM = async (id: string) => {
    loading.value = true;
    try {
      await BOMService.delete(id);
      toastService.success((t("BOM.BOMDeletedSuccessfully")));
      apiBOM.value = apiBOM.value.filter((b) => b.id !== id);
      fetchBOM(pageIndex.value)
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
      await BOMService.toggleActive(id, isActive);
      toastService.success((t("BOM.BOMUpdatedSuccessfully")));
      await fetchBOM(pageIndex.value);
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
    if (field === "ParentItemId") {
      ParentItemId.value = value;
    }
    fetchBOM(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchBOM(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchBOM(1);
  }

  return {
    loading,
    apiBOM,
    tableData,
    fetchBOM,
    fetchBOMById,
    createBOM,
    updateBOM,
    deleteBOM,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchBOM(p),
    onSearch,
    onFilterChange,
    onSort
  };
}