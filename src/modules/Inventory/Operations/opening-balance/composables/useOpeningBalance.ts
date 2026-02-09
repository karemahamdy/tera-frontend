import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import type { OpeningBalance } from "../types/OpeningBalance";
import { OpeningBalanceService } from "../services/OpeningBalance.service";

const loading = ref(false);
const apiOpeningBalance = ref<OpeningBalance[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const StatusFilter = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useOpeningBalance() {
  const { t } = useI18n();

  const fetchOpeningBalance = async (page = 1) => {
    loading.value = true;
    try {
      const response: any = await OpeningBalanceService.getAll({
        pageIndex: page,
        pageSize: pageSize.value,
        searchingWord: searchTerm.value,
        orderBy: orderBy.value,
        orderDirection: orderDirection.value,
        StatusFilter: StatusFilter.value
      });
      const payload = response && response.data ? response.data : response;
      apiOpeningBalance.value = payload.items ?? [];
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

  const fetchOpeningBalanceById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await OpeningBalanceService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createOpeningBalance = async (payload: any) => {
    loading.value = true;
    try {
      const response = await OpeningBalanceService.create(payload);
      toastService.success(t("OpeningBalance.OpeningBalanceCreatedSuccessfully"));
      await fetchOpeningBalance(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateOpeningBalance = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await OpeningBalanceService.update(id, payload);
      toastService.success(t("OpeningBalance.OpeningBalanceUpdatedSuccessfully"));
      await fetchOpeningBalance(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteOpeningBalance = async (id: string) => {
    loading.value = true;
    try {
      await OpeningBalanceService.delete(id);
      toastService.success((t("OpeningBalance.OpeningBalanceDeletedSuccessfully")));
      apiOpeningBalance.value = apiOpeningBalance.value.filter((b) => b.id !== id);
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
      await OpeningBalanceService.toggleActive(id, isActive);
      toastService.success((t("OpeningBalance.OpeningBalanceUpdatedSuccessfully")));
      await fetchOpeningBalance(pageIndex.value);
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
    fetchOpeningBalance(1);
  };

  const onSearch = (term: string) => {
    searchTerm.value = term;
    fetchOpeningBalance(1);
  };

  const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
    orderBy.value = orderByField;
    orderDirection.value = direction;
    fetchOpeningBalance(1);
  }

  return {
    loading,
    apiOpeningBalance,
    tableData,
    fetchOpeningBalance,
    fetchOpeningBalanceById,
    createOpeningBalance,
    updateOpeningBalance,
    deleteOpeningBalance,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchOpeningBalance(p),
    onSearch,
    onFilterChange,
    onSort
  };
}