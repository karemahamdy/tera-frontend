import { computed, ref } from "vue";
import { GroupRolesService } from "../services/userGroup.service";
import type {
  GroupRole,
  RemoveRoleFromGroupRequest,
  UpdateAssignRolesToGroupRequest,
} from "../types/userGroupRoles";
import { toastService } from "@/app/services/toastService";

export function useGroupRoles() {
  const loading = ref(false);
  const roles = ref<GroupRole[]>([]);
  const roleOptions = ref<{ id: string; name: string }[]>([]);
  const branchOptions = ref<{ id: string; name: string }[]>([]);
  const error = ref<string | null>(null);
  const validationErrors = ref<Record<string, string[]>>({});
  const branches = ref<any[]>([]);

  const fetchRolesByGroupId = async (groupId: string) => {
    try {
      loading.value = true;
      const resp = await GroupRolesService.getRolesByGroupId(groupId);
      roles.value = resp.data;
      toastService.success("Role fetched from group successfully");
    }  catch (err: any) {
      const errors =
        err?.response?.data?.errors || err?.response?.data?.validationErrors;
      if (errors && typeof errors === "object") {
        validationErrors.value = errors;
      }
      toastService.error(err);
  }finally {
      loading.value = false;
    }
};

  const deleteRoleFromGroup = async (payload: RemoveRoleFromGroupRequest) => {
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
  }finally {
      loading.value = false;
    }
};

  const updateRoleInGroup = async (
    payload: UpdateAssignRolesToGroupRequest
  ) => {
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
  }finally {
      loading.value = false;
    }
};

 const fetchLookups = async () => {
    loading.value = true;
    try {
      const branchResp = await GroupRolesService.getBranchLookups();
      branchOptions.value = (branchResp || []).map((b: any) => {
        const rawId = b.id ?? b.branchId ?? b.value ?? b.branchCode ?? b;
        return { id: String(rawId), name: b.name ?? b.label ?? b.branchName ?? String(b) };
      });
      branches.value = branchOptions.value;

      const rolesResp = await GroupRolesService.getRolesLookups();
      roleOptions.value = (rolesResp || []).map((r: any) => {
        const rawId = r.id ?? r.roleId ?? r.value ?? r.roleCode ?? r;
        return { id: String(rawId), name: r.name ?? r.label ?? r.roleName ?? String(r) };
      });
    } catch (err: any) {
      error.value = err.message || "Error fetching lookups";
    } finally {
      loading.value = false;
    }
  };

  const tableData = computed(() =>
    roles.value.map((role) => ({
      roleId: role.roleId,
      groupId: role.groupId,
      roleName: role.roleName,
      accessScope: role.groupAccessScope,
      branches: role.branchNames.join(" ") || "Access all branches",
    }))
  );

  return {
    loading,
    roles,
    branches,
    roleOptions,
    branchOptions,
    error,
    tableData,
    fetchRolesByGroupId,
    deleteRoleFromGroup,
    updateRoleInGroup,
    fetchLookups,
  };
}

