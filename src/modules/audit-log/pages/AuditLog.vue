<script setup>
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAudit } from "../composables/useAudit";
// import { useFilters } from "@/composables/useFilters";

const { t } = useI18n();
const router = useRouter();
const loading = ref(false);
const showDeleteDialog = ref(false);
const rowToDelete = ref(null);

const { fetchAuditLogs, filteredTableData, pageIndex, pageSize, totalCount, onSearch, onSort, setPage } = useAudit();
// const { filters, filteredData: filteredByFilters, onFilterChange } = useFilters(filteredTableData);

onMounted(() => {
    fetchAuditLogs();
});

const filtersOperation = [
    {
        placeholder: "auditLog.allUsers",
        value: null,
        field: "allUsers",
        options: [
            { label: "auditLog.allUsers", value: null },
            { label: "Mick Taylor", value: "Mick Taylor" },
        ],
    },
    {
        placeholder: "auditLog.allActions",
        value: null,
        field: "allActions",
        options: [
            { label: "auditLog.allActions", value: null },
            { label: "Create", value: "Create" },
            { label: "Update", value: "Update" },
            { label: "Delete", value: "Delete" },
            { label: "Assign", value: "Assign" },
        ],
    },
];

const columns = computed(() => {
    const Columns = [
        { field: 'Created', header: t('auditLog.dateTime'), type: 'dateTimeDetailed', sortable: true },
        { field: 'user', header: t('auditLog.user'), sortable: true },
        { field: 'action', header: t('auditLog.action'), sortable: true, type: 'slot' },
        { field: 'module', header: t('auditLog.module'), sortable: true },
        { field: 'screen', header: t('auditLog.screen'), sortable: true },
        { field: 'entity', header: t('auditLog.entity'), sortable: true },
        { field: 'branch', header: t('auditLog.branch'), sortable: true },
        { field: 'transactionID', header: t('auditLog.transactionID'), sortable: true },
    ];

    return Columns;
});

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="accessControl" subtitle="auditLog.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="auditLog.title" subtitle="auditLog.subtitle" :showExport="true" :showFilter="true"
                    @filter-change="onFilterChange" :filters="filters" searchPlaceholder="auditLog.searchPlaceholder"
                    @search="onSearch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="filteredTableData" :loading="loading" @page-change="setPage" @order-change="(payload) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy>
                    <template #col-action="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <Badge v-if="data.action == 'Create'" :value="data.action" severity="success" />
                            <Badge v-else-if="data.action == 'Update'" :value="data.action" severity="warn" />
                            <Badge v-else-if="data.action == 'Delete'" :value="data.action" severity="danger" />
                            <Badge v-else-if="data.action == 'Assign'" :value="data.action" severity="info" />
                        </div>
                    </template>
                </DynamicTable>
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