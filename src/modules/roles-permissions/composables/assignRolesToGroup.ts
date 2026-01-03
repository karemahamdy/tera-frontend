import { computed, ref } from "vue";
import { GroupRolesService } from "../services/userGroup.service";
import type {
  GroupRole,
  RemoveRoleFromGroup,
  GetRolesToGroup
} from "../types/userGroupRoles";
import { toastService } from "@/app/services/toastService";
import { useRouter } from "vue-router";

export function useGroupRoles() {

  const loading = ref(false);
  const roles = ref<GroupRole[]>([]);
  const error = ref<string | null>(null);
  const validationErrors = ref<Record<string, string[]>>({});
  const branches = ref<any[]>([]);
  const router = useRouter();

  const fetchRolesByGroupId = async (groupId: string) => {
    try {
      loading.value = true;
      const resp = await GroupRolesService.getRolesByGroupId(groupId);
      roles.value = resp.data;
      toastService.success("Role fetched from group successfully");
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteRoleFromGroup = async (payload: RemoveRoleFromGroup) => {
    try {
      loading.value = true;
      await GroupRolesService.removeRoleFromGroup(payload);
      roles.value = roles.value.filter((r) => r.roleId !== payload.roleId);
      toastService.success("Role removed from group successfully");
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };
  
 const createRoleGroup = async (payload: GetRolesToGroup) => {
  try {
    loading.value = true;
    await GroupRolesService.createRolesToGroup(payload);
    toastService.success("Role assigned to group successfully");
      router.push({ name: "ListGroupRoles" });
  } catch (err: any) {
    const errors =
      err?.response?.data?.errors || err?.response?.data?.validationErrors;
    if (errors && typeof errors === "object") {
      validationErrors.value = errors;
    }
    toastService.error(err);
  } finally {
    loading.value = false;
  }
};

  const updateRoleGroup = async (payload: GetRolesToGroup) => {
    try {
      loading.value = true;
      await GroupRolesService.updateAssignRolesToGroup(payload);
      toastService.success("Role updated in group successfully");
    } catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const tableData = computed(() =>
    roles.value.map((role) => ({
      roleId: role.roleId,
      groupId: role.groupId,
      roleName: role.roleName,
      groupAccessScope: role.groupAccessScope,
      branches: role.branchNames.join(" ") || "Access all branches",
    }))
  );

  return {
    loading,
    roles,
    branches,
    error,
    tableData,
    fetchRolesByGroupId,
    deleteRoleFromGroup,
    updateRoleGroup,
   createRoleGroup
  };
}
