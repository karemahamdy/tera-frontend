import { ref } from "vue";
import type {
  GroupResponse,
  UserFilterBody,
  UserResponse,
} from "../types/reports";
import {
  GroupService,
  PermissionService,
  UserService,
} from "../services/reports.service";

export function useReports() {
  const data = ref<any[]>([]);
  const loading = ref(false);
  const totalRecords = ref(0);

  const pageIndex = ref(1);
  const pageSize = 10;

  const filtersBody = ref<UserFilterBody>({ pageIndex: 1, pageSize });
  const permissionFiltersBody = ref<any>({ pageIndex: 1, pageSize });

  const fetchUsers = async (reset = false) => {
    try {
      loading.value = true;
      if (reset) {
        pageIndex.value = 1;
        data.value = [];
      }
      filtersBody.value.pageIndex = pageIndex.value;
      filtersBody.value.pageSize = pageSize;

      const response = (await UserService.getUsers(
        filtersBody.value
      )) as UserResponse;
      const items = response.data.items || [];
      data.value = reset ? items : [...data.value, ...items];
      // data.value = items
      totalRecords.value = response.data.totalCount;
    } finally {
      loading.value = false;
    }
  };

  const fetchGroups = async (reset = false) => {
    try {
      loading.value = true;
      if (reset) {
        pageIndex.value = 1;
        data.value = [];
      }
      filtersBody.value.pageIndex = pageIndex.value;
      filtersBody.value.pageSize = pageSize;
      const response = (await GroupService.getGroup(
        filtersBody.value
      )) as GroupResponse;
      // const items = response.data.items || [];
      const items = (response.data.items || []).map((item: any) => ({
        ...item,
        isActive: item.status,
      }));
      data.value = reset ? items : [...data.value, ...items];
      totalRecords.value = response.data.totalCount;
    } finally {
      loading.value = false;
    }
  };

  const fetchPermission = async (reset = false) => {
    try {
      loading.value = true;
      if (reset) {
        pageIndex.value = 1;
        data.value = [];
      }
      permissionFiltersBody.value.pageIndex = pageIndex.value;
      permissionFiltersBody.value.pageSize = pageSize;

      const response = (await PermissionService.getPermission(
        permissionFiltersBody.value
      )) as any;
      const items = response.data.items || [];
      data.value = reset ? items : [...data.value, ...items];
      totalRecords.value = response.data.totalCount;
    } finally {
      loading.value = false;
    }
  };

  const clearPermissionData = () => {
    data.value = [];
    totalRecords.value = 0;
  };

  const setFilters = (filters: any) => {
    filtersBody.value = { ...filtersBody.value, ...filters, pageIndex: 1 };
    fetchUsers(true);
  };

  const setUsersPage = (page: number) => {
    if (page === pageIndex.value) return;

    pageIndex.value = page;
    fetchUsers(false);
  };

  const setGroupPage = (page: number) => {
    if (page === pageIndex.value) return;

    pageIndex.value = page;
    fetchGroups(false);
  };

  const setFilter = (filters: any) => {
    filtersBody.value = { ...filtersBody.value, ...filters, pageIndex: 1 };
    fetchGroups(true);
  };

  const setPermissionFilter = (filters: any) => {
    permissionFiltersBody.value = { ...permissionFiltersBody.value, ...filters, pageIndex: 1 };
    fetchPermission(true);
  };

  const setPermissionPage = (page: number) => {
    if (page === pageIndex.value) return;

    pageIndex.value = page;
    fetchPermission(false);
  };



  return {
    data,
    loading,
    totalRecords,
    pageIndex,
    pageSize,
    fetchUsers,
    fetchGroups,
    fetchPermission,
    clearPermissionData,
    setFilters,
    setFilter,
    setUsersPage,
    setGroupPage,
    setPermissionFilter,
    setPermissionPage
  };
}
