import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { DowntimeService } from "../services/Downtime.service";
import type { Downtime } from "../types/Downtime";

export function useDowntime() {
  const loading = ref(false);
const apiDowntime = ref<Downtime[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const MachineId = ref('');
const WorkOrderId = ref('');
const DowntimeType = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

  const { t } = useI18n();

  const fetchDowntime = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await DowntimeService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        MachineId: MachineId.value,
        DowntimeType: DowntimeType.value,
        WorkOrderId: WorkOrderId.value
      });
      const payload = response && response.data ? response.data : response;
      apiDowntime.value = payload.items ?? [];
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

  const fetchDowntimeById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await DowntimeService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createDowntime = async (payload: any) => {
    loading.value = true;
    try {
      const response = await DowntimeService.create(payload);
      toastService.success(t("downtime.DowntimeCreatedSuccessfully"));
      await fetchDowntime(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateDowntime = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await DowntimeService.update(id, payload);
      toastService.success(t("downtime.DowntimeUpdatedSuccessfully"));
      await fetchDowntime(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteDowntime = async (id: string) => {
    loading.value = true;
    try {
      await DowntimeService.delete(id);
      toastService.success((t("downtime.DowntimeDeletedSuccessfully")));
      apiDowntime.value = apiDowntime.value.filter((b) => b.id !== id);
      fetchDowntime(pageIndex.value)
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
    if (field === "MachineId") {
      MachineId.value = value;
    }
     if (field === "DowntimeType") {
      DowntimeType.value = value;
    }
     if (field === "WorkOrderId") {
      WorkOrderId.value = value;
    }
    fetchDowntime(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchDowntime(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchDowntime(1);
  }

  return {
    loading,
    apiDowntime,
    tableData,
    fetchDowntime,
    fetchDowntimeById,
    createDowntime,
    updateDowntime,
    deleteDowntime,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchDowntime(p),
    onSearch,
    onFilterChange,
    onSort
  };
}