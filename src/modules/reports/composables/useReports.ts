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
      filtersBody.value.pageIndex = pageIndex.value;
      filtersBody.value.pageSize = pageSize;
      const response = (await PermissionService.getPermission(
        filtersBody.value
      )) as GroupResponse;
      const items = response.data.items || [];
      data.value = reset ? items : [...data.value, ...items];
      totalRecords.value = response.data.totalCount;
    } finally {
      loading.value = false;
    }
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

  const setFilter = (filters: any) => {
    filtersBody.value = { ...filtersBody.value, ...filters, pageIndex: 1 };
    fetchGroups(true);
  };

  const setPermission = (filters: any) => {
    filtersBody.value = { ...filtersBody.value, ...filters, pageIndex: 1 };
    fetchPermission(true);
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
    setPermission,
    setFilters,
    setFilter,
    setUsersPage,
  };
}
