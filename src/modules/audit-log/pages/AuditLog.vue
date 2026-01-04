<script setup lang="ts">
; import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAudit } from "../composables/useAudit";

const { t } = useI18n();
const { fetchAuditLogs, filteredTableData, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, loading } = useAudit();

onMounted(() => {
    fetchAuditLogs();
});

const columns = computed(() => {
    const Columns = [
        { field: 'Created', header: t('auditLog.dateTime'), type: 'dateTimeDetailed', sortable: true },
        { field: 'user', header: t('auditLog.user'), sortable: true },
        { field: 'action', header: t('auditLog.action'), sortable: true, type: 'badge', Class: "custom-badge",},
        { field: 'module', header: t('auditLog.module'), sortable: true },
        { field: 'screen', header: t('auditLog.screen'), sortable: true },
        { field: 'entity', header: t('auditLog.entity'), sortable: true },
        { field: 'branch', header: t('auditLog.branch'), sortable: true },
        { field: 'transactionID', header: t('auditLog.transactionID'), sortable: true },
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

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="auditLog.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="auditLog.title" subtitle="auditLog.subtitle" :showExport="true" :showFilter="true"
                    searchPlaceholder="auditLog.searchPlaceholder" @search="onSearch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredTableData" :loading="loading" @page-change="setPage"
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