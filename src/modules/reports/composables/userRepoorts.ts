import { ref } from "vue";
import type { UserFilterBody, UserResponse } from "../types/reports";
import { UserService } from "../services/user.service";

export function useUserReport() {
  const data = ref<any[]>([]);
  const loading = ref(false);
  const totalRecords = ref(0);

  const pageIndex = ref(1);
  const pageSize = 20;

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

      const response = await UserService.getUsers(filtersBody.value)  as UserResponse;
      const items = response.data.items || [];
      data.value = reset ? items : [...data.value, ...items];
      totalRecords.value = response.data.totalCount;
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (data.value.length >= totalRecords.value) return;
    pageIndex.value += 1;
    await fetchUsers();
  };
  const onLazyLoad = async (event: any) => {
    pageIndex.value = Math.floor(event.first / pageSize) + 1;
    await fetchUsers();
  };

  const setFilters = (filters: any) => {
    filtersBody.value = { ...filtersBody.value, ...filters, pageIndex: 1 };
    fetchUsers(true);
  };

  return { data, loading, fetchUsers, loadMore, totalRecords, setFilters, onLazyLoad };
}

