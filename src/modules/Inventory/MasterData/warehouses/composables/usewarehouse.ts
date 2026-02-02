import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import { FileService } from "@/app/services/file.service";
import { warehousesService } from "../services/warehouse.service";
import type { warehouses } from "../types/warehouse";

const loading = ref(false);
const apiWarehouse = ref<warehouses[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const WarehouseType = ref('');
const IsActive = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useWarehouse() {
  const { t } = useI18n();

  const fetchWarehouse = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await warehousesService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        WarehouseType: WarehouseType.value,
        IsActive: IsActive.value
      });
      const payload = response && response.data ? response.data : response;
      apiWarehouse.value = payload.items ?? [];
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

  const fetchWarehouseById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await warehousesService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createWarehouse = async (payload: any) => {
    loading.value = true;
    try {
      const response = await warehousesService.create(payload);
      toastService.success(t("Warehouse.WarehouseCreatedSuccessfully"));
      await fetchWarehouse(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateWarehouse = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await warehousesService.update(id, payload);
      toastService.success(t("Warehouse.WarehouseUpdatedSuccessfully"));
      await fetchWarehouse(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteWarehouse = async (id: string) => {
    loading.value = true;
    try {
      await warehousesService.delete(id);
      toastService.success((t("Warehouse.WarehouseDeletedSuccessfully")));
      apiWarehouse.value = apiWarehouse.value.filter((b) => b.id !== id);
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
      await warehousesService.toggleActive(id, isActive);
      toastService.success(`Warehouse is now ${isActive ? 'Active' : 'in Active'}`);
      await fetchWarehouse(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const importWarehouse = async (file: File) => {
    try {
      await FileService.uploadFile(
        "LedgerDetailCard/Import-Warehouses",
        {
          file: file,
        },
        "WarehouseFile"
      );
      toastService.success(t("Warehouse.WarehouseImportedSuccessfully"));
      fetchWarehouse(1);
    } catch (error) {
      toastService.error(error as string);
    }
  };

  const onFilterChange = (filter: {
    filter: { field: string };
    value: string;
  }) => {
    const field = filter.filter.field;
    const value = filter.value;
    if (field === "status") {
      IsActive.value = value ;
    }
     if (field === "type") {
      WarehouseType.value = value;
    }
    fetchWarehouse(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchWarehouse(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchWarehouse(1);
  }

  const exportWarehouse = async () => {
    try {
      const response = await warehousesService.exportData({
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        WarehouseType: WarehouseType.value,
        IsActive: IsActive.value
      });
      FileService.downloadBlob(response, "LedgerDetailCard-data.csv");
    } catch (err: any) {
      toastService.error(err);
    }
  };

  return {
    loading,
    apiWarehouse,
    fetchWarehouse,
    importWarehouse,
    fetchWarehouseById,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchWarehouse(p),
    onSearch,
    onFilterChange,
    onSort,
    exportWarehouse
  };
}