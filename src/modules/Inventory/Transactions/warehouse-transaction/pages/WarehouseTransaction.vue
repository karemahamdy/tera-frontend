<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useWarehouseTransaction } from "../composables/useWarehouseTransaction";
import { useLookups } from "@/composables/useLookups";
import alertIcon from '@/assets/images/alert.png';

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const isDeleting = ref(false);
const rowToDelete = ref<any | null>(null);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, apiWarehouseTransaction, fetchWarehouseTransaction, deleteWarehouseTransaction } = useWarehouseTransaction();
const { warehouseLookup, getWarehouseLookups } = useLookups();  

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
     Promise.all([
        getWarehouseLookups(), 
        fetchWarehouseTransaction()
    ]);
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "warehouseTransaction.allDirections",
            value: null,
            field: "TransactionType",
            options: [
                { label: t("inventoryRequest.inbound"), value: "Inbound" },
                { label: t("inventoryRequest.outbound"), value: "Outbound" },
                { label: t("inventoryRequest.transfer"), value: "Transfare" },
            ],
        },
        {
            placeholder: "warehouses.title",
            value: null,
            field: "Warehouse",
            options: [
                ...warehouseLookup.value
            ],
        },
        {
            placeholder: "warehouseTransaction.allStatus",
            value: null,
            field: "TransactionStatus",
           isSingle: true,
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                  { label: t("button.Pending"), value: "Pending" },
                { label: t("button.Posted"), value: "Posted" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'waybillNumber', header: t('warehouseTransaction.waybillId'), sortable: true },
        { field: 'transactionDate', header: t('warehouseTransaction.date'), type: 'date', sortable: true },
        { field: 'transactionDirection', header: t('warehouseTransaction.direction'), type: 'slot', sortable: true },
        { field: 'requestReference', header: t('warehouseTransaction.request'), sortable: true },
        { field: 'warehouse', header: t('warehouseTransaction.warehouse'), type: 'slot', sortable: true },
        { field: 'status', header: t('warehouseTransaction.ledgerStatus'), sortable: true },
        { field: 'action', header: t('warehouseTransaction.action'), type: 'action', sortable: false },
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
            name: "WarehouseTransactionFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "WarehouseTransactionFormView",
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
    await deleteWarehouseTransaction(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addWarehouseTransaction = () => {
    router.push({name: 'WarehouseTransactionCreate' });
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="inventoryRequest.transaction" actionName="warehouseTransaction.warehouseTransaction" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="warehouseTransaction.warehouseTransaction" subtitle="warehouseTransaction.description" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="warehouseTransaction.newTransaction" :showMultiFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="warehouseTransaction.searchPlaceholder" @search="onSearch" :onMainBtnClick="addWarehouseTransaction" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiWarehouseTransaction" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
                    <template v-slot:["col-transactionDirection"]="{ data }">
                        <div v-if="data.transactionDirection === 'Transfer'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
                            <VsxIcon iconName="ArrowSwapHorizontal" type="linear" />
                            <span>{{ data.transactionDirection }}</span>
                        </div>
                        <div v-else-if="data.transactionDirection === 'In'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-success-50 text-success-500">
                            <VsxIcon iconName="ArrowDown" type="linear" />
                            <span>{{ data.transactionDirection }}</span>
                        </div>
                        <div v-else class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-danger-50 text-danger-500">
                            <VsxIcon iconName="ArrowUp" type="linear" />
                            <span>{{ data.transactionDirection }}</span>
                        </div>
                    </template>
                    <template v-slot:["col-status"]="{ data }">
                        <div class="flex align-items-center gap-2">
                            <Badge :class="data.status == 'Posted' ? 'status-active' : 'status-inactive'"
                                style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                            <span :class="data.status == 'Posted' ? 'status-text-active' : 'status-text-inactive'">
                                {{ data.status }}
                            </span>
                        </div>
                    </template>
                    <template v-slot:["col-warehouse"]="{ data }">
                        <span>{{ data.warehouse?.name }}</span>
                    </template>
                    </DynamicTable>
              
            </template>
        </card>
     <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('warehouseTransaction.deleteItemConfirm')"
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