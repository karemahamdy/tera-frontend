import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { OperationsMasterService } from "../services/OperationsMaster.service";
import type { OperationsMaster } from "../types/OperationsMaster";

export function useOperationsMaster() {
  const loading = ref(false);
  const apiOperationsMaster = ref<OperationsMaster[]>([]);
  const tableData = ref<any[]>([]);

  const pageIndex = ref(1);
  const pageSize = ref(10);
  const totalCount = ref(0);
  const totalPages = ref(1);

  const searchTerm = ref("");
  const orderBy = ref("");
  const IsActive = ref<boolean | null | string>(null);
  const orderDirection = ref<"asc" | "desc">("desc");

  const { t } = useI18n();

  const fetchOperationsMaster = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await OperationsMasterService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        IsActive: IsActive.value,
      });
      const payload = response && response.data ? response.data : response;
      apiOperationsMaster.value = payload.items ?? [];
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

  const fetchOperationsMasterById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await OperationsMasterService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createOperationsMaster = async (payload: any) => {
    loading.value = true;
    try {
      payload.overheadPercentage =
        payload.overheadPercentage === "" ||
        payload.overheadPercentage === undefined
          ? null
          : Number(payload.overheadPercentage);
           payload.laborCostPerHour =
        payload.laborCostPerHour === "" ||
        payload.laborCostPerHour === undefined
          ? null
          : Number(payload.laborCostPerHour);
      const response = await OperationsMasterService.create(payload);
      toastService.success(
        t("OperationsMaster.OperationsMasterCreatedSuccessfully"),
      );
      await fetchOperationsMaster(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateOperationsMaster = async (id: string, payload: any) => {
    loading.value = true;
    try {
         payload.overheadPercentage =
        payload.overheadPercentage === "" ||
        payload.overheadPercentage === undefined
          ? null
          : Number(payload.overheadPercentage);
           payload.laborCostPerHour =
        payload.laborCostPerHour === "" ||
        payload.laborCostPerHour === undefined
          ? null
          : Number(payload.laborCostPerHour);
      const response = await OperationsMasterService.update(id, payload);
      toastService.success(
        t("OperationsMaster.OperationsMasterUpdatedSuccessfully"),
      );
      await fetchOperationsMaster(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOperationsMaster = async (id: string) => {
    loading.value = true;
    try {
      await OperationsMasterService.delete(id);
      toastService.success(
        t("OperationsMaster.OperationsMasterDeletedSuccessfully"),
      );
      apiOperationsMaster.value = apiOperationsMaster.value.filter(
        (b) => b.id !== id,
      );
      fetchOperationsMaster(pageIndex.value);
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
      await OperationsMasterService.toggleActive(id, isActive);
      toastService.success(
        t("OperationsMaster.OperationsMasterUpdatedSuccessfully"),
      );
      await fetchOperationsMaster(pageIndex.value);
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
    fetchOperationsMaster(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchOperationsMaster(1);
  };

  const onSort = (orderByField: string, direction: "asc" | "desc") => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchOperationsMaster(1);
  };

  return {
    loading,
    apiOperationsMaster,
    tableData,
    fetchOperationsMaster,
    fetchOperationsMasterById,
    createOperationsMaster,
    updateOperationsMaster,
    deleteOperationsMaster,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchOperationsMaster(p),
    onSearch,
    onFilterChange,
    onSort,
  };
}
