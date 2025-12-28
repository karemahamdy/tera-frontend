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
    groupName: "Administration",
    description: "Controls system settings",
    assignedRoles: "System Administrator",
    userCount: "4",
    status: "Actuive",
    created: "2023-01-01",
  },
]);
const loading = ref(false);
const filtersOperation = [
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
    placeholder: "reports.userCount",
    value: null,
    field: "userCount",
    options: [
      { label: "User Count", value: null },
      { label: "User 1", value: "User 1" },
    ],
  },
  {
    placeholder: "reports.allRoles",
    value: null,
    field: "allRoles",
    options: [
      { label: "All Roles", value: null },
      { label: "Role 1", value: "Role 1" },
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
        { field: 'groupName', header: t('reports.groupName') },
        { field: 'description', header: t('reports.description') },
        { field: 'assignedRoles', header: t('reports.assignedRoles') },
        { field: 'userCount', header: t('reports.userCount') },
        { field: 'status', header: t('reports.status') },
        { field: 'created', header: t('reports.created'), type: "date" },
    ];
    return Columns;
});
</script>
<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="reports.title" subtitle="reports.userGroupReport" />
    <card class="bg-white rounded-[10px] w-full overflow-x-auto">
      <!-- PageHeader component -->
      <template #title>
        <PageHeader
          title="reports.userGroupReportInfo"
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
