import { computed, ref } from "vue";
import { GroupRolesService } from "../services/userGroup.service";
import type {
  GroupRole,
  RemoveRoleFromGroup,
  GetRolesToGroup,
  GroupRoleDetails,
} from "../types/userGroupRoles";
import { toastService } from "@/app/services/toastService";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export function useGroupRoles() {
  const { t } = useI18n();

  const loading = ref(false);
  const roles = ref<GroupRole[]>([]);
  const currentRole = ref<GroupRoleDetails | null>(null);
  const error = ref<string | null>(null);
  const branches = ref<any[]>([]);
  const router = useRouter();

  const fetchRolesByGroupId = async (groupId: string) => {
    try {
      loading.value = true;
      const resp = await GroupRolesService.getRolesByGroupId(groupId);
      roles.value = resp.data;
      toastService.success(t("roles.rolesFetched"));
    } catch (err: any) {
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
      toastService.success(t("roles.roleRemovedFromGroup"));
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createRoleGroup = async (payload: GetRolesToGroup) => {
    try {
      loading.value = true;
      await GroupRolesService.createRolesToGroup(payload);
      toastService.success(t("roles.roleAssigned"));
      router.push({ name: "ListGroupRoles" });
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getRoleToGroupById = async (
    groupId: string,
    roleId: string
  ): Promise<GroupRoleDetails | null> => {
    try {
      loading.value = true;
      const resp = await GroupRolesService.getRoleToGroupById(groupId, roleId);
      currentRole.value = resp;
      return resp;
    } catch (err: any) {
      toastService.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateRoleGroup = async (payload: GetRolesToGroup) => {
    try {
      loading.value = true;
      await GroupRolesService.updateRolesToGroup(payload);
      toastService.success(t("roles.roleUpdatedInGroup"));
    } catch (err: any) {
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
      branches:
        role.branchNames.map((name) => name).join(" - ") ||
        "Access all branches",
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
    createRoleGroup,
    getRoleToGroupById,
  };
}
