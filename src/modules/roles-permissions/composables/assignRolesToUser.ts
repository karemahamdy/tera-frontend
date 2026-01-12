import { ref } from "vue";
import router from "@/app/router";
import type { AssignRole, Role } from "../types/user";
import { UserRolesService } from "../services/user.service";
import { toastService } from "@/app/services/toastService";
import { useI18n } from "vue-i18n";

export function useRolesUser() {
  const { t } = useI18n();

  const loading = ref(false);
  const roles = ref<Role[]>([]);

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

  const deleteRole = async (userId: string, roleId: string)  => {
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

  // const list = ref<UserListItem[]>([]);
  // const userData = ref<UserByID>({} as UserByID);

  // const pagination = ref<Pagination>({
  //   PageIndex: 1,
  //   PageSize: 10,
  //   OrderBy: undefined,
  //   OrderDirection: undefined,
  //   total: 0,
  // });

  // const getList = async () => {
  //   loading.value = true;
  //   try {
  //     const res = await UserRolesService.getList(pagination.value);
  //     list.value = res.data.items;
  //     pagination.value.total = res.data.totalCount;
  //   } catch (error) {
  //     toastService.error(error as string);
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // const changePage = async (page: number) => {
  //   pagination.value.PageIndex = page;
  //   await getList();
  // };

  // const sort = async (orderData: {
  //   orderBy: string;
  //   direction: "asc" | "desc";
  // }) => {
  //   pagination.value.OrderBy = orderData.orderBy;
  //   pagination.value.OrderDirection = orderData.direction;
  //   pagination.value.PageIndex = 1;
  //   await getList();
  // };

  // const deleteItem = async (id: string) => {
  //   loading.value = true;
  //   try {
  //     await UserRolesService.delete(id);
  //     toastService.success(t("users.userDeleted"));
  //     await getList();
  //   } catch (error) {
  //     toastService.error(error as string);
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  // const editRole = async (id: string, data: UserPayload) => {
  //   try {
  //     loading.value = true;
  //     await UserRolesService.update(id, data);
  //     toastService.success(t("users.userUpdated"));
  //     router.replace({ name: "UserManagement" });
  //   } catch (error) {
  //     toastService.error(error as string);
  //   } finally {
  //     loading.value = false;
  //   }
  // }

  // const getUserRoleById = async (id: string) => {
  //   loading.value = true;
  //   try {
  //     const res = await UserRolesService.getById(id);
  //     userData.value = res.data;
  //   } catch (error) {
  //     toastService.error(error as string);
  //   } finally {
  //     loading.value = false;
  //   }
  // };

  return {
    loading,
    roles,
    assignRole,
    fetchRolesByUserId,
    deleteRole
    // list,
    // userData,
    // pagination,
    // getList,
    // changePage,
    // sort,
    // deleteItem,
    // editRole,
    // getUserRoleById
  };
}
