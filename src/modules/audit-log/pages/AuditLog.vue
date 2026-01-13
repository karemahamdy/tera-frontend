<script setup lang="ts">
; import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAudit } from "../composables/useAudit";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const { fetchAuditLogs, List, pageIndex, pageSize, totalCount, onFilterChange, onSearch, onSort, setPage, loading } = useAudit();
const {
  branchesLookups,
  getBranchLookups,
  getIPLookups,
  getScreenLookups,
  screensLookups,
  modulesLookups,
  getModuleLookups,
  usersLookups,
  getUsersLookups
} = useLookups();

const filtersOperation = computed(() => {
  return [
    {
      placeholder: "auditLog.user",
      value: null,
      field: "auditLog.user",
      options: [
        ...usersLookups.value
      ],
    },
    {
      placeholder: "auditLog.module",
      value: null,
      field: "auditLog.module",
      options: [
        ...modulesLookups.value
      ],
    },
    {
      placeholder: "auditLog.screen",
      value: null,
      field: "auditLog.screen",
      options: [
        ...screensLookups.value
      ],
    },
    {
      placeholder: "activeSessions.allBranches",
      value: null,
      field: "allBranches",
      options: [

        ...branchesLookups.value
      ],
    },
    {
      placeholder: "activeSessions.allStatus",
      value: null,
      field: "status",
      options: [

        { label: t("button.active"), value: "IsActive" },
        { label: t("button.inactive"), value: "InActive" },
      ],
    }
  ]
});
const columns = computed(() => {
    const Columns = [
        { field: 'timestamp', header: t('auditLog.dateTime'), type: 'dateTimeDetailed', sortable: true },
        { field: 'userName', header: t('auditLog.user'), sortable: true },
        { field: 'actionType', header: t('auditLog.action'), sortable: true, type: 'badge', Class: "custom-badge",},
        { field: 'moduleName', header: t('auditLog.module'), sortable: true },
        { field: 'screenName', header: t('auditLog.screen'), sortable: true },
        { field: 'entityName', header: t('auditLog.entity'), sortable: true },
        { field: 'branchNameEn', header: t('auditLog.branch'), sortable: true },
        { field: 'transactionNumber', header: t('auditLog.transactionID'), sortable: true },
    ];
    return Columns;
});

const firstRecord = computed(() => {
    return (pageIndex.value - 1) * pageSize.value + 1;
});

const lastRecord = computed(() => {
    const last = pageIndex.value * pageSize.value;
    return Math.min(last, totalCount.value || last);
});

onMounted(() => {
  Promise.all([(fetchAuditLogs(), getBranchLookups(), getIPLookups(), getModuleLookups(), getScreenLookups(), getUsersLookups())])
});

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="auditLog.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="auditLog.title" subtitle="auditLog.subtitle" :showExport="true" :showFilter="true" @filter-change="onFilterChange" :filters="filtersOperation"
                 searchPlaceholder="auditLog.searchPlaceholder" @search="onSearch"  :hasMenu="false"  templateFileUrl="/audit-logs/export" dataFileUrl="/audit-logs/export"
                  templateFileName="auditLog-template.csv" dataFileName="auditLog-data.csv" />
                  <div>
                  
                    </div>
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="List" :loading="loading" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy />
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
    background: #FAF9F9;
    font-weight: 600;
    color: var(--color-gray-700);
    font-size: 13px;
    padding: 20px 16px;
}
</style>