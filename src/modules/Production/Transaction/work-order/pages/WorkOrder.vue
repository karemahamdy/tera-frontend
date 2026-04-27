<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useworkOrder } from "../composables/useWorkOrder";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteworkOrder, onFilterChange, fetchworkOrder, apiworkOrder } = useworkOrder();

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

onMounted(() => {
    fetchworkOrder();
});
const filtersOperation = computed(() => {
    return [

        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.Completed"), value: "IsActive" },
                { label: t("button.InProgress"), value: "IsActive" },
                { label: t("button.New"), value: "InActive" },
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'workOrderNumber', header: t('workOrder.woNumber'), sortable: true },
        { field: 'itemName', header: t('workOrder.item'), type: 'slot', sortable: true },
        { field: 'quantity', header: t('workOrder.quantity'), type: 'slot', sortable: true },
        { field: 'warehouseInName', header: t('workOrder.WarehouseIn'), sortable: true },
        { field: 'warehouseOutName', header: t('workOrder.WarehouseOut'), sortable: true },
        { field: 'plannedStartDate', header: t('workOrder.Plannedstart'), sortable: true },
        { field: 'status', header: t('status'), sortable: true },
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
            name: "workOrderFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "workOrderFormView",
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
    await deleteworkOrder(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addworkOrder = () => {
    router.push({ name: 'workOrderCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="operation.transactions" actionName="workOrder.workOrder" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="workOrder.workOrder" subtitle="workOrder.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="workOrder.addNew" :showFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="workOrder.searchPlaceholder" @search="onSearch" :onMainBtnClick="addworkOrder" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiworkOrder" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template v-slot:["col-code"]="{ data }">
                        <span class="text-primary-500 cursor-pointer">{{ data.code }}</span>
                    </template>
                    <template v-slot:["col-status"]="{ data }">
                        <div v-if="data.status === 'In Progress'"
                            class="flex align-items-center justify-center rounded-full gap-1 p-1 text-sm bg-warning-50 text-warning-500 border border-warning-500">
                            <span>{{ data.status }}</span>
                        </div>
                        <div v-else-if="data.status === 'Completed'"
                            class="flex align-items-center justify-center rounded-full gap-1 p-1 text-sm bg-success-50 text-success-500 border border-success-500">
                            <span>{{ data.status }}</span>
                        </div>
                        <div v-else
                            class="flex align-items-center justify-center rounded-full gap-1 p-1 text-sm bg-primary-50 text-primary-500 border border-primary-500">
                            <span>{{ data.status }}</span>
                        </div>
                    </template>
                </DynamicTable>
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon"
            :title="$t('workOrder.deleteworkOrderConfirm')" :buttons="[
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