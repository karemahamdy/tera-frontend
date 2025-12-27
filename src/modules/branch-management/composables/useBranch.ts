import { toastService } from "@/app/services/toastService";
import { ref } from "vue";
import { BranchService } from "../services/branch.service";
import type { AddBranch } from "../types/branches";

  const loading = ref(false);

export function useBranches() {

 const createBranch = async (payload: AddBranch) => {
    loading.value = true;
    try {
      const response = await BranchService.create(payload);
      toastService.success("Branch created successfully");
    //   await fetchGroups();
      return response;
    } catch (err) {
      console.error("Error creating branch:", err);
      toastService.error("Failed to create branch");
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return {
    createBranch,
  };
}