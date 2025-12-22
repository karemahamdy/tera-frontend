import { ref, watch, computed } from "vue";
import { GroupService } from "../services/groupService";
import type { GroupApiItem, GroupTableItem, AddGroup } from "../types/groups";
import { toastService } from "../../../app/services/toastService";

export function useGroups() {
  const loading = ref(false);
  const apiGroups = ref<GroupApiItem[]>([]);
  const tableData = ref<GroupTableItem[]>([]);

  const fetchGroups = async () => {
    loading.value = true;
    try {
      apiGroups.value = await GroupService.getAll(1);
    } catch (err) {
      console.error("Error fetching groups:", err);
      toastService.error("Failed to fetch groups");
    } finally {
      loading.value = false;
    }
  };

  const fetchGroupById = async (id: string): Promise<GroupApiItem | null> => {
    loading.value = true;
    try {
      const group = await GroupService.getById(id);
      return group;
    } catch (err) {
      console.error("Error fetching group:", err);
      toastService.error("Failed to fetch group details");
      return null;
    } finally {
      loading.value = false;
    }
  };

   const toggleActive = async (id: string, isActive: boolean) => {
    loading.value = true;
    try {
      await GroupService.toggleActive(id, isActive);
      const row = tableData.value.find(row => row.id === id);
      if (row) row.isActive = isActive;
      toastService.success(`Group is now ${isActive ? "Active" : "Inactive"}`);
    } catch (err) {
      console.error("Error toggling group status:", err);
      toastService.error("Failed to update group status");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  watch(
    apiGroups,
    (groups) => {
      console.log(groups);
      
      // tableData.value = groups.map((group) => ({
      //   id: group.id,
      //   GroupName: group.name,
      //   Description: group.description ?? "-",
      //   AssignedRoles: group.rolesAssingedToGroup.length
      //     ? group.rolesAssingedToGroup.map((group) => group.name).join(", ")
      //     : "-",
      //   UserCount: group.UserCount,
      //   Created: "-",
      //   isActive: group.isActive ?? false,
      // }));
    },
    { immediate: true }
  );

  const filteredTableData = computed(() =>
    tableData.value.map((row) => ({ ...row }))
  );

  const createGroup = async (payload: AddGroup) => {
    loading.value = true;
    try {
      const response = await GroupService.create(payload);
      toastService.success("Group created successfully");
      await fetchGroups();
      return response;
    } catch (err) {
      console.error("Error creating group:", err);
      toastService.error("Failed to create group");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateGroup = async (id: string, payload: AddGroup) => {
    loading.value = true;
    try {
      const response = await GroupService.update(id, payload);
      toastService.success("Group updated successfully");
      await fetchGroups();
      return response;
    } catch (err) {
      console.error("Error updating group:", err);
      toastService.error("Failed to update group");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteGroup = async (id: string) => {
    loading.value = true;
    try {
      await GroupService.delete(id);
      toastService.success("Group deleted successfully");
      apiGroups.value = apiGroups.value.filter((group) => group.id !== id);
    } catch (err) {
      console.error("Error deleting group:", err);
      toastService.error("Failed to delete group");
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    fetchGroups,
    fetchGroupById,
    filteredTableData,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleActive
  };
}