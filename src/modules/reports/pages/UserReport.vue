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
    username: "johndoe",
    email: "johndoe@example.com",
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
        { field: 'internalID', header: t('reports.internalID'), sortable: true },
        { field: 'userName', header: t('reports.userName'), sortable: true },
        { field: 'fullName', header: t('reports.fullName'), sortable: true },
        { field: 'email', header: t('reports.email'), sortable: true },
        { field: 'department', header: t('reports.department'), sortable: true },
        { field: 'userGroup', header: t('reports.userGroup'), sortable: true },
        { field: 'isAdmin', header: t('reports.isAdmin'), sortable: true },
        { field: 'status', header: t('reports.status'), sortable: true },
        { field: 'accessScope', header: t('reports.accessScope'), sortable: true },
        { field: 'lastLogin', header: t('reports.lastLogin'), sortable: true, type: "date" },
    ];
    return Columns;
});
</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userReport" />
    <card class="bg-[#ffffff] rounded-[10px]">
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
