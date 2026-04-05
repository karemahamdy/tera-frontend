import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { MachinesService } from "../services/Machines.service";
import type { Machines } from "../types/Machines";

export function useMachines() {
const loading = ref(false);
const apiMachines = ref<Machines[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const IsActive = ref('');
const WorkCenterId = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

 const { t } = useI18n();
 
  const fetchMachines = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await MachinesService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        IsActive: IsActive.value,
        WorkCenterId: WorkCenterId.value
      });
      const payload = response && response.data ? response.data : response;
      apiMachines.value = payload.items ?? [];
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

  const fetchMachinesById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await MachinesService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createMachines = async (payload: any) => {
    loading.value = true;
    try {
      const response = await MachinesService.create(payload);
      toastService.success(t("Machines.MachinesCreatedSuccessfully"));
      await fetchMachines(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateMachines = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await MachinesService.update(id, payload);
      toastService.success(t("Machines.MachinesUpdatedSuccessfully"));
      await fetchMachines(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteMachines = async (id: string) => {
    loading.value = true;
    try {
      await MachinesService.delete(id);
      toastService.success((t("Machines.MachinesDeletedSuccessfully")));
      apiMachines.value = apiMachines.value.filter((b) => b.id !== id);
      fetchMachines(pageIndex.value)
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
      await MachinesService.toggleActive(id, isActive);
      toastService.success((t("Machines.MachinesUpdatedSuccessfully")));
      await fetchMachines(pageIndex.value);
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
    if (field === "IsActive") {
      IsActive.value = value;
    }
     if (field === "WorkCenterId") {
      WorkCenterId.value = value;
    }
    fetchMachines(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchMachines(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchMachines(1);
  }

  return {
    loading,
    apiMachines,
    tableData,
    fetchMachines,
    fetchMachinesById,
    createMachines,
    updateMachines,
    deleteMachines,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchMachines(p),
    onSearch,
    onFilterChange,
    onSort
  };
}