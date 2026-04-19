<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useDowntime } from "../composables/useDowntime";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, apiDowntime, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteDowntime, onFilterChange, fetchDowntime } = useDowntime();
const { getMachineLookups, machineLookups } = useLookups();

const emit = defineEmits(['search', 'action-menu-click']);
const customItems = [
     {
      slot: true,
      label: t("button.view"),
      icon: "Eye",
      color: "#3F5FAC",
      action: 'view',
    },
];

onMounted(() => {
    fetchDowntime();
    getMachineLookups()
});

const filtersOperation = computed(() => {
    return [
           {
            placeholder: "downtime.machine",
            value: null,
            field: "MachineId",
            options: [
                  { label: t("button.all"), value: null },
                ...machineLookups.value,
            ],
        },
        {
            placeholder: "downtime.WorkOrder",
            value: null,
            field: "status",
            options: [
                  { label: t("button.all"), value: null },
                { label: t("button.active"), value: "IsActive" },
                { label: t("button.inactive"), value: "InActive" },
            ],
        },
        {
            placeholder: "downtime.type",
            value: null,
            field: "DowntimeType",
           options: [
                { label: t("button.all"), value: null },
                { label: t("type.Breakdown"), value: 1 },
                { label: t("type.Setup"), value: 2 },
                { label: t("type.MaterialShortage"), value: 3 },
                { label: t("type.QualityIssue"), value: 4 },
                { label: t("type.PowerOutage"), value: 5 },
                { label: t("type.OperatorAbsence"), value: 6 },
                { label: t("type.Other"), value: 7 },
                
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'date', header: t('downtime.date'), sortable: true },
        { field: 'machineName', header: t('downtime.machine'), type: 'slot', sortable: true },
        { field: 'workOrderNumber', header: t('downtime.WorkOrder'), type: 'slot', sortable: true },
        { field: 'downtimeType', header: t('downtime.DowntimeType'), sortable: true },
        { field: 'duration', header: t('downtime.duration'), sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
     if (!totalCount.value || totalCount.value === 0) return 0;
    const last = pageIndex.value * pageSize.value;
    return Math.min(last, totalCount.value || last);
});


const confirmDelete = (row: any) => {
    rowToDelete.value = row;
    showDeleteDialog.value = true;
};

const handleActionMenu = async (payload: any) => {
    const action = payload.action || payload;
    const data = payload.data || payload.row || payload;
    if (action === 'edit') {
        router.push({
            name: "DowntimeFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "DowntimeFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteDowntime(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const adddowntime = () => {
    router.push({name: 'DowntimeCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="operation.transactions" actionName="downtime.downtime" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="downtime.Downtime" subtitle="downtime.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="downtime.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="downtime.searchPlaceholder" @search="onSearch" :onMainBtnClick="adddowntime" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiDowntime" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('downtime.deleteConfirm')"
            :buttons="[
                { label: $t('button.cancel'), variant: 'ghost', action: 'cancel' },
                { label: $t('button.delete'), variant: 'danger', action: 'confirm' },
            ]" @confirm="handleDeleteConfirm" />

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