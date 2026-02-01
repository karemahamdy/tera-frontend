import { toastService } from "@/app/services/toastService";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { LDCService } from "../services/LDC.service";
import type { LDC } from "../types/LDC";
import { FileService } from "@/app/services/file.service";

const loading = ref(false);
const apiLDC = ref<LDC[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const orderDirection = ref<'asc' | 'desc'>('desc');

export function useLDC() {
  const { t } = useI18n();

 const fetchLDC = async (page = 1) => {
  loading.value = true;
  try {
    const response: any = await LDCService.getAll({
      pageIndex: page,
      pageSize: pageSize.value,
      searchingWord: searchTerm.value,
      orderBy: orderBy.value,
      orderDirection: orderDirection.value
    });
    const payload = response && response.data ? response.data : response;
    apiLDC.value = payload.items ?? [];
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

  const fetchLDCById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await LDCService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createBranch = async (payload: any) => {
    loading.value = true;
    try {
      const response = await LDCService.create(payload);
      toastService.success(t("LDC.LDCCreatedSuccessfully"));
      await fetchLDC(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBranch = async (id: string, payload: any) => {
    loading.value = true;
    try {
      const response = await LDCService.update(id, payload);
      toastService.success(t("LDC.LDCUpdatedSuccessfully"));
      await fetchLDC(pageIndex.value);
      return response;
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBranch = async (id: string) => {
    loading.value = true;
    try {
      await LDCService.delete(id);
      toastService.success((t("LDC.LDCDeletedSuccessfully")));
      apiLDC.value = apiLDC.value.filter((b) => b.id !== id);
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
      await LDCService.toggleActive(id, isActive);
      toastService.success(`LDC is now ${isActive ? 'Active' : 'in Active'}`);
      await fetchLDC(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const importLDC = async (file: File) => {
    try {
      await FileService.uploadFile(
        "LedgerDetailCard/Import-LDCs",
        {
          file: file,
        },
        "LDCFile"
      );
      toastService.success(t("LDC.LDCImportedSuccessfully"));
      fetchLDC(1);
    } catch (error) {
      toastService.error(error as string);
    }
  };

const onSearch = (term: string) => {
  searchTerm.value = term;
  fetchLDC(1);     
};
const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
  orderBy.value = orderByField;
  orderDirection.value = direction;
  fetchLDC(1);
} 
  const filteredTableData = computed(() => tableData.value.map((r) => ({ ...r })));

  return {
    loading,
    apiLDC,
    tableData,
    filteredTableData,
    fetchLDC,
    importLDC,
    fetchLDCById,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchLDC(p),
    onSearch,
    onSort
  };
}