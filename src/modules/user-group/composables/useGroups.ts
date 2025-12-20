import { ref, watch, computed } from "vue";
import { GroupService } from "../services/groupService";
import type { GroupApiItem, GroupTableItem } from "../types/groupList";
import { toastService } from "../../../app/services/toastService";

export function useGroups() {
  const loading = ref(false);
  const apiGroups = ref<GroupApiItem[]>([]);
  const tableData = ref<GroupTableItem[]>([]);

  const fetchGroups = async () => {
    loading.value = true;
    try {
      apiGroups.value = await GroupService.getAll(1);
    } finally {
      loading.value = false;
    }
  };

  watch(
    apiGroups,
    (groups) => {
      tableData.value = groups.map((group) => ({
        id: group.id,
        GroupName: group.name,
        Description: group.description ?? "-",
        AssignedRoles: group.rolesAssingedToGroup.length
          ? group.rolesAssingedToGroup.map((r) => r.name).join(", ")
          : "-",
        UserCount: group.rolesAssingedToGroup.length,
        Created: "-",
      }));
    },
    { immediate: true }
  );

  const filteredTableData = computed(() =>
    tableData.value.map((row) => ({ ...row }))
  );

const deleteGroup = async (id: string) => {
  loading.value = true;
  try {
    const response = await GroupService.delete(id);
    toastService.success("Group deleted successfully");
    console.log("Delete response:", response);
    apiGroups.value = apiGroups.value.filter((g) => g.id !== id);
  } catch (err) {
     toastService.error("Failed to delete group")
    console.error("Error deleting group:", err);
  } finally {
    loading.value = false;
  }
};

  return {
    loading,
    fetchGroups,
    filteredTableData,
    deleteGroup, 
  };
}
