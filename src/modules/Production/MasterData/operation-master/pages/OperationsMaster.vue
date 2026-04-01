<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useOperationsMaster } from "../composables/useOperationsMaster";
import RulesCard from "@/sharedComponents/RulesCard.vue";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteOperationsMaster, fetchOperationsMaster, onFilterChange, apiOperationsMaster } = useOperationsMaster();
const { getProcessLookups, processLookups } = useLookups();

const emit = defineEmits(['search', 'action-menu-click']);
const customItems = [
     {
        action: "toggleActive",
        changeStatus: true,
        label: t("button.active"),
        type: "switch",
        key: "isActive",
    },
     {
      slot: true,
      label: t("button.view"),
      icon: "Eye",
      color: "#3F5FAC",
      action: 'view',
    },
];
const rules = [
    "OperationsMaster.note",
    "OperationsMaster.operation",
    "OperationsMaster.processCode",
];

onMounted(() => {
    fetchOperationsMaster();
    getProcessLookups();
});
const filtersOperation = computed(() => {
    return [
          {
            placeholder: "OperationsMaster.name",
            value: null,
            field: "ProcessId",
            options: [
                  { label: t("usersManagement.allStatus"), value: null },
                   ...processLookups.value
            ],
        },
        {
            placeholder: "status",
            value: null,
            field: "status",
            options: [
                  { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.active"), value: true },
                { label: t("button.inactive"), value: false },
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'processCode', header: t('OperationsMaster.code'), sortable: true },
        { field: 'processName', header: t('OperationsMaster.name'), type: 'slot', sortable: true },
        { field: 'laborCostPerHour', header: t('OperationsMaster.LaborCost/Hr'), type: 'slot', sortable: true },
        { field: 'overheadPercentage', header: t('OperationsMaster.Overhead'), sortable: true },
        { field: 'isActive', header: t('status'), type: 'status', sortable: true },
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
            name: "OperationsMasterFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "OperationsMasterFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
    if (action === "toggleActive") {
        if (loading.value) return;
        await toggleActive(data.id, !data.isActive);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteOperationsMaster(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addOperationsMaster = () => {
    router.push({name: 'OperationsMasterCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="masterData" actionName="OperationsMaster.operationsMaster" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="OperationsMaster.operationsMaster" subtitle="OperationsMaster.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="OperationsMaster.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="OperationsMaster.searchPlaceholder" @search="onSearch" :onMainBtnClick="addOperationsMaster" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiOperationsMaster" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
               <template  v-slot:["col-processCode"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline">{{ data.processCode }}</span>
                    </template>
                    </DynamicTable>
            </template>
            <template #footer>
                <RulesCard title="OperationsMaster.ruleHeader" :items="rules" color="primary" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('OperationsMaster.deleteConfirm')"
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