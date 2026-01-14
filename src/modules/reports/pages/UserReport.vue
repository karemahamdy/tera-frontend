<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import ReportFilters from "../components/ReportFilters.vue";
import { useI18n } from "vue-i18n";
import { useLookups } from "@/composables/useLookups";
import { useReports } from "../composables/useReports";
import { UserService } from "../services/reports.service";
import { FileService } from "@/app/services/file.service";

const { t } = useI18n();
let hasSearched = ref(false);
const {
  groupsLookups,
  departmentsLookups,
  getDepartmentsLookups,
  getGroupLookups,
} = useLookups();
const {
  data,
  loading,
  setFilters,
  totalRecords,
  pageIndex,
  pageSize,
  setUsersPage
} = useReports();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "usersManagement.allGroups",
      value: filterState.value.userGroup,
      field: "userGroup",
      options: [...groupsLookups.value],
    },
    {
      placeholder: "usersManagement.allStatus",
      value: filterState.value.isActive,
      field: "isActive",
      options: [
        { label: t("button.active"), value: true },
        { label: t("button.inactive"), value: false },
      ],
    },
    {
      placeholder: "usersManagement.allScopes",
      value: filterState.value.isGlobal,
      field: "isGlobal",
      options: [
        { label: t("users.global"), value: true },
        { label: t("users.branch"), value: false },
      ],
    },
    {
      placeholder: "usersManagement.allDepartment",
      value: filterState.value.department,
      field: "department",
      options: [...departmentsLookups.value],
    },
  ];
});
const filterState = ref({
  userGroup: null,
  isActive: null,
  isGlobal: null,
  department: null,
});

const firstRecord = computed(() => {
  return data.value.length === 0 ? 0 : (pageIndex.value - 1) * pageSize + 1;
});

const lastRecord = computed(() => {
  if (data.value.length === 0) return 0;
  const last = firstRecord.value + data.value.length - 1;
  return last > totalRecords.value ? totalRecords.value : last;
});

const columns = computed(() => {
  const Columns = [
    { field: "internalId", header: t("reports.internalID") },
    { field: "username", header: t("reports.userName") },
    { field: "fullName", header: t("reports.fullName") },
    { field: "email", header: t("reports.email") },
    { field: "departmentName", header: t("reports.department") },
    { field: "userGroupName", header: t("reports.userGroup") },
    { field: "isAdmin", header: t("reports.isAdmin") },
    { field: "isActive", header: t("reports.status") },
    { field: "isGlobal", header: t("reports.accessScope") },
    { field: "lastLogin", header: t("reports.lastLogin"), type: "date" },
  ];
  return Columns;
});

const getFilterBody = (filters: any[]) => {
  const body: any = {
    pageIndex: 1,
    pageSize: pageSize,
    isActive: null,
    isGlobal: null,
    groupIds: null,
    departmentIds: null,
  };
  filters.forEach((f) => {
    switch (f.field) {
      case "userGroup":
        body.groupIds = f.value ?? null;
        break;
      case "department":
        body.departmentIds = f.value ?? null;
        break;
      case "isActive":
        body.isActive = f.value ?? false;
        break;
      case "isGlobal":
        body.isGlobal = f.value ?? false;
        break;
    }
  });
  return body;
};

const onSearch = (filters: any[]) => {
  const body = getFilterBody(filters);
  setFilters(body);
  hasSearched.value = true;
};

const onExport = async () => {
  try {
    const body = getFilterBody(filtersOperation.value);
    const response = await UserService.getUsersExport(body);
    FileService.downloadBlob(response, "UserReport.xlsx");
  } catch (e) {
    console.error(e);
  }
};

const onClearFilters = () => {
  filterState.value = {
    userGroup: null,
    isActive: null,
    isGlobal: null,
    department: null,
  };
  hasSearched.value = false;
};
const onFilterChange = ({ filter, value }: any) => {
  filterState.value[filter.field as keyof typeof filterState.value] = value;
};
onMounted(() => {
  Promise.all([getGroupLookups(false), getDepartmentsLookups(false)]);
  const body = getFilterBody([]);
  setFilters(body);
  hasSearched.value = true;
});
</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userReport" />
    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader title="reports.userReportInfo" :showExport="true" :showSearch="false" :onExport="onExport" />
        <ReportFilters :showExport="true" :showFilter="true" :filters="filtersOperation" @search="onSearch"
          @clear="onClearFilters" @filter-change="onFilterChange" />
      </template>
      <template #content>
        <div>
          <DynamicTable v-if="hasSearched" :columns="columns" :data="data" :loading="loading" :paginator="false" :scrollPaginator="true"
            :first="firstRecord" :last="lastRecord" :rows="pageSize" :totalRecords="totalRecords" @page-change="setUsersPage" lazy>
            <template #col-isGlobal="{ data }">
              {{ data.isGlobal ? t("users.global") : t("users.branch") }}
            </template>
            <template #col-isAdmin="{ data }">
              {{ data.isAdmin ? t("Admin") : t("User") }}
            </template>
          </DynamicTable>
        </div>
      </template>
    </card>
  </div>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 16px;
  color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #faf9f9;
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: 13px;
  padding: 20px 16px;
}
</style>
