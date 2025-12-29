import { toastService } from "@/app/services/toastService";
import { ref, watch, computed } from "vue";
import { BranchService } from "../services/branch.service";
import type { AddBranch, Branch } from "../types/branches";
import { useI18n } from "vue-i18n";

const loading = ref(false);
const apiBranches = ref<Branch[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const searchTerm = ref('');
const orderBy = ref('');
const orderDirection = ref<'asc' | 'desc'>('asc');


const lastError = ref<string | null>(null);
const validationErrors = ref<Record<string, string[]>>({});

export function useBranches() {
  const { t } = useI18n();

 const fetchBranches = async (page = 1) => {
  loading.value = true;
  lastError.value = null;
  try {
    const response: any = await BranchService.getAll({
      pageIndex: page,
      pageSize: pageSize.value,
      searchingWord: searchTerm.value,
      orderBy: orderBy.value,
      orderDirection: orderDirection.value
    });

    const payload = response && response.data ? response.data : response;
    apiBranches.value = payload.items ?? [];
    pageIndex.value = payload.pageIndex ?? page;
    pageSize.value = payload.pageSize ?? pageSize.value;
    totalCount.value = payload.totalCount ?? 0;
    totalPages.value = payload.totalPages ?? 1;  
  } catch (err: any) {
    lastError.value = err?.message ?? "Failed to fetch branches";
    toastService.error(err);
  } finally {
    loading.value = false;
  }
};


  const fetchBranchById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await BranchService.getById(id);
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const createBranch = async (payload: AddBranch) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      const response = await BranchService.create(payload);
      toastService.success(t("branch.branchCreatedSuccessfully"));
      await fetchBranches(pageIndex.value);
      return response;
    } catch (err: any) {
      const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === 'object') {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBranch = async (id: string, payload: AddBranch) => {
    loading.value = true;
    validationErrors.value = {};
    try {
      const response = await BranchService.update(id, payload);
      toastService.success(t("branch.branchUpdatedSuccessfully"));
      await fetchBranches(pageIndex.value);
      return response;
    } catch (err: any) {
      const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === 'object') {
        validationErrors.value = errors;
      }
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBranch = async (id: string) => {
    loading.value = true;
    try {
      await BranchService.delete(id);
      toastService.success("Branch deleted successfully");
      apiBranches.value = apiBranches.value.filter((b) => b.id !== id);
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
      await BranchService.toggleActive(id, isActive);
      toastService.success(`Branch is now ${isActive ? 'Active' : 'in Active'}`);
      await fetchBranches(pageIndex.value);
    } catch (err: any) {
      toastService.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

 watch(
  apiBranches,
  (branches) => {
    tableData.value = branches.map((b) => ({
      id: b.id,
      nameAr: b.nameAr,
      nameEn: b.nameEn,
      code: b.code,
      addressAr: b.addressAr,
      addressEn: b.addressEn,
     isActive: b.isActive ,
     status: b.isActive ? "Active" : "in Active",
      createAt: b.createAt,
    }));
  },
  { immediate: true }
);

const onSearch = (term: string) => {
  searchTerm.value = term;
  fetchBranches(1);     
};
const onSort = (orderByField: string, direction: 'asc' | 'desc') => {
  orderBy.value = orderByField;
  orderDirection.value = direction;
  fetchBranches(1);
} 
  const filteredTableData = computed(() => tableData.value.map((r) => ({ ...r })));

  const clearErrors = () => {
    validationErrors.value = {};
    lastError.value = null;
  };

  return {
    loading,
    apiBranches,
    tableData,
    filteredTableData,
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch,
    deleteBranch,
    toggleActive,
    pageIndex,
    pageSize,
    totalCount,
    totalPages,
    setPage: (p: number) => fetchBranches(p),
    lastError,
    validationErrors,
    clearErrors,
    onSearch,
    onSort
  };
}