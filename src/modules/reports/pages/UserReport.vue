<script setup lang="ts">
import { computed, ref } from "vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import { useFilters } from "@/composables/useFilters";
import ReportFilters from "../components/ReportFilters.vue";
import { useI18n } from "vue-i18n";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
const { t } = useI18n();
const data = ref([
  {
    id: 1,
    internalID: "johndoe",
    userName: "johndoe",
    fullName: "John Doe",
    email: "johndoe@example.com",
    department: "johndoe",
    userGroup: "johndoe",
    isAdmin: "yes",
    status: "Actuive",
    accessScope: "yes",
    lastLogin: "2023-01-01",
  },
]);
const loading = ref(false);
const filtersOperation = [
  {
    placeholder: "reports.allDepartments",
    value: null,
    field: "allDepartments",
    options: [
      { label: "All Departments", value: null },
      { label: "Department 1", value: "Department 1" },
    ],
  },
  {
    placeholder: "reports.allGroups",
    value: null,
    field: "allGroups",
    options: [
      { label: "All Groups", value: null },
      { label: "Group 1", value: "Group 1" },
    ],
  },
  {
    placeholder: "reports.status",
    value: null,
    field: "status",
    options: [
      { label: "All Status", value: null },
      { label: "Status 1", value: "status 1" },
    ],
  },
  {
    placeholder: "reports.scope",
    value: null,
    field: "scope",
    options: [
      { label: "All Scope", value: null },
      { label: "Scope 1", value: "scope 1" },
    ],
  },
];

const {
  filters,
  filteredData: filteredByFilters,
  onFilterChange,
} = useFilters(data.value, filtersOperation);

const columns = computed(() => {
    const Columns = [
        { field: 'internalID', header: t('reports.internalID') },
        { field: 'userName', header: t('reports.userName') },
        { field: 'fullName', header: t('reports.fullName') },
        { field: 'email', header: t('reports.email') },
        { field: 'department', header: t('reports.department') },
        { field: 'userGroup', header: t('reports.userGroup') },
        { field: 'isAdmin', header: t('reports.isAdmin') },
        { field: 'status', header: t('reports.status') },
        { field: 'accessScope', header: t('reports.accessScope') },
        { field: 'lastLogin', header: t('reports.lastLogin'), type: "date" },
    ];
    return Columns;
});
</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userReport" />
    <card class="bg-[#ffffff] rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="reports.userReportInfo"
          :showExport="false"
          :showSearch="false"
        />

        <ReportFilters
          :showExport="true"
          :showFilter="true"
          @filter-change="onFilterChange"
          :filters="filters"
        />
      </template>
      <!-- DynamicTable component -->
      <template #content>
        <DynamicTable :columns="columns" :data="filteredByFilters" :loading="loading" :paginator="false" />
      </template>
    </card>
  </div>
</template>
