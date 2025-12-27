import { toastService } from "@/app/services/toastService";
import { ref, watch, computed } from "vue";
import { BranchService } from "../services/branch.service";
import type { AddBranch, Branch } from "../types/branches";

const loading = ref(false);
const apiBranches = ref<Branch[]>([]);
const tableData = ref<any[]>([]);

const pageIndex = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const totalPages = ref(1);

const lastError = ref<string | null>(null);
const validationErrors = ref<Record<string, string[]>>({});

export function useBranches() {
  const fetchBranches = async (page = 1) => {
    loading.value = true;
    lastError.value = null;
    try {
      const response: any = await BranchService.getAll(page, pageSize.value);
      const payload = response && response.data ? response.data : response;
      apiBranches.value = payload.items ?? [];
      pageIndex.value = payload.pageIndex ?? page;
      pageSize.value = payload.pageSize ?? pageSize.value;
      totalCount.value = payload.totalCount ?? 0;
      totalPages.value = payload.totalPages ?? 1;
    } catch (err: any) {
      console.error("Error fetching branches:", err);
      lastError.value = err?.message ?? "Failed to fetch branches";
      toastService.error("Failed to fetch branches");
    } finally {
      loading.value = false;
    }
  };

  const fetchBranchById = async (id: string) => {
    loading.value = true;
    try {
      const resp = await BranchService.getById(id);
      return resp;
    } catch (err) {
      console.error("Error fetching branch:", err);
      toastService.error("Failed to fetch branch");
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
      toastService.success("Branch created successfully");
      // refresh current page
      await fetchBranches(pageIndex.value);
      return response;
    } catch (err: any) {
      console.error("Error creating branch:", err);
      // try to capture validation errors if provided by backend
      const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === 'object') {
        validationErrors.value = errors;
      }
      toastService.error("Failed to create branch");
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
      toastService.success("Branch updated successfully");
      await fetchBranches(pageIndex.value);
      return response;
    } catch (err: any) {
      console.error("Error updating branch:", err);
      const errors = err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === 'object') {
        validationErrors.value = errors;
      }
      toastService.error("Failed to update branch");
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
    } catch (err) {
      console.error("Error deleting branch:", err);
      toastService.error("Failed to delete branch");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    loading.value = true;
    try {
      await BranchService.toggleActive(id, isActive);
      const row = apiBranches.value.find((r) => r.id === id);
      if (row) row.isActive = isActive;
      toastService.success(`Branch is now ${isActive ? 'Active' : 'Inactive'}`);
    } catch (err) {
      console.error('Error toggling branch status:', err);
      toastService.error('Failed to update branch status');
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
        BranchCode: b.code,
        NameAr: b.nameAr,
        NameEn: b.nameEn,
        Address: b.addressEn || b.addressAr || '-',
        isActive: b.isActive,
        createAt: b.createAt,
      }));
    },
    { immediate: true }
  );

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
  };
}