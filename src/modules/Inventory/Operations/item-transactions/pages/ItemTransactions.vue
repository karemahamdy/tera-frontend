<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useItemTransactions } from "../composables/useItemTransactions";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const { apiItemTransactions, loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, fetchItemTransactions } = useItemTransactions();

const customItems = [

    {
        slot: true,
        label: t("button.view"),
        icon: "Eye",
        color: "#3F5FAC",
        action: 'view',
    },
];

const filtersOperation = computed(() => {
    return [
        {
            placeholder: "operation.allTypes",
            value: null,
            field: "typeFilter",
            options: [
                { label: t("operation.allTypes"), value: null },
                { label: t("operation.transfer"), value: "TransferTransactions" },
                { label: t("operation.merge"), value: "ItemMerge" },
            ],
        }
    ]
});


const columns = computed(() => {
    const Columns = [
        { field: 'sourceItemCode', header: t('operation.sourceItem'), sortable: true },
        { field: 'targetItemCode', header: t('operation.targetItem'), sortable: true },
        { field: 'warehouseCode', header: t('operation.warehouse'), sortable: true },
        { field: 'transactionsCount', header: t('operation.transactions'), sortable: true },
        { field: 'operationType', header: t('operation.type'), type: 'slot', sortable: true },
        { field: 'transactionDate', header: t('operation.transferDate'), type: 'date', sortable: true },
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
            name: "ItemTransactionsFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "ItemTransactionsFormView",
            params: { id: data.id },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const addItemTransactions = () => {
    router.push({ name: 'ItemTransactionsCreate' });
};

onMounted(() => {
    fetchItemTransactions();
});

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.title" actionName="operation.itemTransactions" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="operation.itemTransferMerge" subtitle="operation.itemTransferMergeDescription"
                    :showExport="false" :showImport="false" :mainBtn="true" mainBtnText="operation.newTransaction"
                    :showFilter="true" :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="operation.itemTransactionsSearchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addItemTransactions" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiItemTransactions" :loading="loading"
                    :customItems="customItems" @action-menu-click="handleActionMenu" :showDelete="true"
                    @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)"
                    :first="firstRecord" :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"
                    @search="onSearch" lazy>
                    <template v-slot:["col-operationType"]="{ data }">
                        <div
                            class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
                            <VsxIcon v-if="data.operationType === 'ItemTransfer'" iconName="ArrowSwapHorizontal" type="linear" />
                            <VsxIcon v-else iconName="Routing2" type="linear" />
                            <span>{{ data.operationType === 'ItemTransfer' ? $t("operation.transfer") : $t('operation.merge') }}</span>
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

.status-active {
    background: var(--color-success-500);
    outline: 1px solid var(--color-success-500);
}

.status-inactive {
    background: var(--color-warning-500);
    outline: 1px solid var(--color-warning-500);
}

.status-text-active {
    color: var(--color-success-500);
}

.status-text-inactive {
    color: var(--color-warning-500);
}
</style>