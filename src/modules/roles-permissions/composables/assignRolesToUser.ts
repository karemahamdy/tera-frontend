import { ref } from "vue";
import router from "@/app/router";
import type { AssignRole, UserRole, Role } from "../types/user";
import { UserRolesService } from "../services/user.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export function useRolesUser() {
  const { t } = useI18n();

  const loading = ref(false);
  const roles = ref<Role[]>([]);
  const role = ref<UserRole | null>(null);

  const assignRole = async (data: AssignRole) => {
    try {
      loading.value = true;
      await UserRolesService.create(data);
      toastService.success(t("usersManagement.rolesAssignedToUser"));
      router.replace({ name: "UserManagement" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  const fetchRolesByUserId = async (userId: string) => {
    try {
      loading.value = true;
      const resp = await UserRolesService.getRolesByUserId(userId);
      roles.value = resp.data.map((role) => ({
        ...role,
        branches:
          role.branchNames.map((name) => name).join(" - ") ||
          "Access all branches",
      }));
      toastService.success(t("roles.rolesFetched"));
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deleteRole = async (userId: string, roleId: string) => {
    try {
      loading.value = true;
      await UserRolesService.delete(userId, roleId);
      roles.value = roles.value.filter((r) => r.roleId !== roleId);
      toastService.success(t("roles.roleRemovedFromGroup"));
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getRoleToUserById = async (userId: string, roleId: string) => {
    try {
      loading.value = true;
      const resp = await UserRolesService.getRoleToGroupById(userId, roleId);
      role.value = resp.data;
    } catch (err: any) {
      toastService.error(err);
    } finally {
      loading.value = false;
    }
  };

  const updateAssignRole = async (data: AssignRole) => {
    try {
      loading.value = true;
      await UserRolesService.update(data);
      toastService.success(t("usersManagement.rolesAssignedToUser"));
      router.replace({ name: "UserManagement" });
    } catch (error) {
      toastService.error(error as string);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    roles,
    role,
    assignRole,
    fetchRolesByUserId,
    deleteRole,
    getRoleToUserById,
    updateAssignRole,
  };
}
