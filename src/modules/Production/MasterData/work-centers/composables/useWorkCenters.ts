import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { workCenterService } from "../services/WorkCenters.service";
import type { workCenter } from "../types/WorkCenters";

export function useworkCenter() {
  const loading = ref(false);
const apiworkCenter = ref<workCenter[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');
const IsActive = ref<boolean | null | string>(null);
const departmentId = ref<string | null | string>(null);

  const { t } = useI18n();

  const fetchworkCenter = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await workCenterService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        IsActive: IsActive.value,
        departmentId: departmentId.value,
      });
      const payload = response && response.data ? response.data : response;
      apiworkCenter.value = payload.items ?? [];
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

  const fetchworkCenterById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await workCenterService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createworkCenter = async (payload: any) => {
    loading.value = true;
    try {
      const response = await workCenterService.create(payload);
      toastService.success(t("workCenter.workCenterCreatedSuccessfully"));
      await fetchworkCenter(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateworkCenter = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await workCenterService.update(id, payload);
      toastService.success(t("workCenter.workCenterUpdatedSuccessfully"));
      await fetchworkCenter(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteworkCenter = async (id: string) => {
    loading.value = true;
    try {
      await workCenterService.delete(id);
      toastService.success((t("workCenter.workCenterDeletedSuccessfully")));
      apiworkCenter.value = apiworkCenter.value.filter((b) => b.id !== id);
      fetchworkCenter(pageIndex.value)
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
      await workCenterService.toggleActive(id, isActive);
      toastService.success((t("workCenter.workCenterUpdatedSuccessfully")));
      await fetchworkCenter(pageIndex.value);
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
      IsActive.value = value;
    }
    if (field === "departmentId") {
      departmentId.value = value;
    }
    fetchworkCenter(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchworkCenter(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchworkCenter(1);
  }

  return {
    loading,
    apiworkCenter,
    tableData,
    fetchworkCenter,
    fetchworkCenterById,
    createworkCenter,
    updateworkCenter,
    deleteworkCenter,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchworkCenter(p),
    onSearch,
    onFilterChange,
    onSort
  };
}