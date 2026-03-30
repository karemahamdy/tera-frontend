<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useProductionReceipts } from "../composables/useProductionReceipts";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteProductionReceipts, onFilterChange } = useProductionReceipts();

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
const data = ref([
    { id: 1, code: 'WC001', name: 'Work Center 1', department: 'Department A', machines: "3 machines", status: "Completed" },
    { id: 2, code: 'WC002', name: 'Work Center 2', department: 'Department B', machines: "3 machines", status: "In Progress" },
    { id: 3, code: 'WC003', name: 'Work Center 3', department: 'Department C', machines: "8 machines", status: "New" },
]);
// onMounted(() => {
//     fetchProductionReceipts();
// });
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
        { field: 'code', header: t('ProductionReceipts.woNumber'), sortable: true },
        { field: 'name', header: t('ProductionReceipts.item'), type: 'slot', sortable: true },
        { field: 'department', header: t('ProductionReceipts.quantity'), type: 'slot', sortable: true },
        { field: 'machines', header: t('ProductionReceipts.WarehouseIn'), sortable: true },
        { field: 'machines', header: t('ProductionReceipts.WarehouseOut'), sortable: true },
        { field: 'machines', header: t('ProductionReceipts.Plannedstart'), sortable: true },
        { field: 'status', header: t('status'), sortable: true },
        { field: 'action', header: t('action') }
    ];

    return Columns;
});

const firstRecord = computed(() => {
    return ((pageIndex.value - 1) * pageSize.value) + 1;
});

const lastRecord = computed(() => {
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
            name: "ProductionReceiptsFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "ProductionReceiptsFormView",
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
    await deleteProductionReceipts(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addProductionReceipts = () => {
    router.push({ name: 'ProductionReceiptsCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="production" subtitle="operation.transactions" actionName="ProductionReceipts.ProductionReceipts" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="ProductionReceipts.ProductionReceipts" subtitle="ProductionReceipts.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="ProductionReceipts.addNew" :showFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="ProductionReceipts.searchPlaceholder" @search="onSearch" :onMainBtnClick="addProductionReceipts" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
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
            :title="$t('ProductionReceipts.deleteProductionReceiptsConfirm')" :buttons="[
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