
<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAudit } from "../composables/useAudit";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const {
  fetchAuditLogs,
  List,
  pageIndex,
  pageSize,
  totalCount,
  onFilterChange,
  onSearch,
  onSort,
  setPage,
  loading,
  fromDate,
  toDate,
} = useAudit();

const {
  branchesLookups,
  screensLookups,
  CodeLookups,
  usersLookups,
  getBranchLookups,
  getIPLookups,
  getScreenLookups,
  getModuleLookups,
  getUsersLookups,
} = useLookups();

const filtersOperation = computed(() => [
  { placeholder: "auditLog.user", value: null, field: "auditLog.user", options: [...usersLookups.value] },
  { placeholder: "auditLog.module", value: null, field: "auditLog.module", options: [...CodeLookups.value] },
  { placeholder: "auditLog.screen", value: null, field: "screen", options: [...screensLookups.value] },
  { placeholder: "activeSessions.allBranches", value: null, field: "allBranches", options: [...branchesLookups.value] },
]);

const columns = computed(() => [
  { field: "timestamp", header: t("auditLog.dateTime"), type: "dateTimeDetailed", sortable: true },
  { field: "userName", header: t("auditLog.user"), sortable: true },
  { field: "actionType", header: t("auditLog.action"), sortable: true, type: "badge", Class: "custom-badge" },
  { field: "moduleName", header: t("auditLog.module"), sortable: true },
  { field: "screenName", header: t("auditLog.screen"), sortable: true },
  { field: "entityName", header: t("auditLog.entity"), sortable: true },
  { field: "branchNameEn", header: t("auditLog.branch"), sortable: true },
  { field: "transactionNumber", header: t("auditLog.transactionID"), sortable: true },
]);

const firstRecord = computed(() => (pageIndex.value - 1) * pageSize.value + 1);
const lastRecord = computed(() => Math.min(pageIndex.value * pageSize.value, totalCount.value));

onMounted(() => {
  fetchAuditLogs();
  getBranchLookups();
  getIPLookups();
  getModuleLookups();
  getScreenLookups();
  getUsersLookups();
});

</script>

<template>
  <div class="p-6 w-full h-full bg-gray-100">
    <ScreenHeader title="accessControl" subtitle="auditLog.title" />
    <card class="bg-[#ffffff] rounded-[10px]">
      <template #title>
        <PageHeader title="auditLog.title" subtitle="auditLog.subtitle" :showExport="true" :showMultiFilter="true"
          @filter-change="onFilterChange" :filters="filtersOperation" searchPlaceholder="auditLog.searchPlaceholder"
          @search="onSearch" :hasMenu="false" templateFileUrl="/audit-logs/export" dataFileUrl="/audit-logs/export"
          templateFileName="auditLog-template.csv" dataFileName="auditLog-data.csv" />
        <div class="flex gap-4 mt-2">
          <div class="w-[50%]"> 
            <label class="block text-gray-600 text-lg ">{{ t("form.fromDate") }}</label>
           <DatePicker v-model="fromDate" showIcon fluid iconDisplay="input" />
          </div>
          <div class="w-[50%]">
            <label class="block text-gray-600 text-lg ">{{ t("form.toDate") }}</label>
            <DatePicker v-model="toDate" showIcon fluid iconDisplay="input" />
          </div>
        </div>
      </template>
      <template #content>
        <DynamicTable :columns="columns" :data="List" :loading="loading" @page-change="setPage"
          @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord" :last="lastRecord"
          :rows="pageSize" :totalRecords="totalCount" lazy />
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
