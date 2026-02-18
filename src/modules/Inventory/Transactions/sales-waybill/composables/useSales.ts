import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { SalesWaybill } from "../types/SalesWaybill";
import { SalesWaybillService } from "../services/SalesWaybill.service";

export function useSalesWaybill() {
  
const loading = ref(false);
const apiSalesWaybill = ref<SalesWaybill[]>([]);
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

  const fetchSalesWaybill = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await SalesWaybillService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiSalesWaybill.value = payload.items ?? [];
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

  const fetchSalesWaybillById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await SalesWaybillService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createSalesWaybill = async (payload: any) => {
    loading.value = true;
    try {
      const response = await SalesWaybillService.create(payload);
      toastService.success(t("salesWaybill.SalesWaybillCreatedSuccessfully"));
      await fetchSalesWaybill(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateSalesWaybill = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await SalesWaybillService.update(id, payload);
      toastService.success(t("salesWaybill.SalesWaybillUpdatedSuccessfully"));
      await fetchSalesWaybill(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteSalesWaybill = async (id: string) => {
    loading.value = true;
    try {
      await SalesWaybillService.delete(id);
      toastService.success((t("salesWaybill.SalesWaybillDeletedSuccessfully")));
      await fetchSalesWaybill(pageIndex.value);
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
    fetchSalesWaybill(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchSalesWaybill(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchSalesWaybill(1);
  }

  return {
    loading,
    apiSalesWaybill,
    tableData,
    fetchSalesWaybill,
    fetchSalesWaybillById,
    createSalesWaybill,
    updateSalesWaybill,
    deleteSalesWaybill,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchSalesWaybill(p),
    onSearch,
    onFilterChange,
    onSort
  };
}