import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { PhysicalCount } from "../types/PhysicalCount";
import { PhysicalCountService } from "../services/PhysicalCountservice";

const loading = ref(false);
const apiPhysicalCount = ref<PhysicalCount[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function usePhysicalCount() {
  const { t } = useI18n();

  const fetchPhysicalCount = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await PhysicalCountService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiPhysicalCount.value = payload.items ?? [];
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

  const fetchPhysicalCountById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await PhysicalCountService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createPhysicalCount = async (payload: any) => {
    loading.value = true;
    try {
      const response = await PhysicalCountService.create(payload);
      toastService.success(t("PhysicalCount.PhysicalCountCreatedSuccessfully"));
      await fetchPhysicalCount(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePhysicalCount = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await PhysicalCountService.update(id, payload);
      toastService.success(t("PhysicalCount.PhysicalCountUpdatedSuccessfully"));
      await fetchPhysicalCount(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePhysicalCount = async (id: string) => {
    loading.value = true;
    try {
      await PhysicalCountService.delete(id);
      toastService.success((t("PhysicalCount.PhysicalCountDeletedSuccessfully")));
      apiPhysicalCount.value = apiPhysicalCount.value.filter((b) => b.id !== id);
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
      await PhysicalCountService.toggleActive(id, isActive);
      toastService.success((t("PhysicalCount.PhysicalCountUpdatedSuccessfully")));
      await fetchPhysicalCount(pageIndex.value);
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
    fetchPhysicalCount(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchPhysicalCount(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchPhysicalCount(1);
  }

  return {
    loading,
    apiPhysicalCount,
    tableData,
    fetchPhysicalCount,
    fetchPhysicalCountById,
    createPhysicalCount,
    updatePhysicalCount,
    deletePhysicalCount,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchPhysicalCount(p),
    onSearch,
    onFilterChange,
    onSort
  };
}