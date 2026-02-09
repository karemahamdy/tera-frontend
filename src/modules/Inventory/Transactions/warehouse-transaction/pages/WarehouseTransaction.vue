<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useWarehouseTransaction } from "../composables/useWarehouseTransaction";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange } = useWarehouseTransaction();

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        waybillId: "PW-2026-001",
        request: "#001",
        reason: "ABC Industrial Supplies",
        warehouse: "#001",
        date: "Oct 11, 2025",
        ledgerStatus: "Posted",
        direction: "Transfer"
      },
      {
        waybillId: "PW-2026-001",
        request: "#001",
        reason: "ABC Industrial Supplies",
        warehouse: "#001",
        date: "Oct 11, 2025",
        ledgerStatus: "Posted",
        direction: "Inbound"
      },
      {
        waybillId: "PW-2026-001",
        request: "#001",
        reason: "ABC Industrial Supplies",
        warehouse: "#001",
        date: "Oct 11, 2025",
        ledgerStatus: "Pending",
        direction: "outbound"
      },
    ],
  },
});
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
    // fetchWarehouseTransaction();
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "warehouseTransaction.allDirections",
            value: null,
            field: "type",
            options: [
                { label: t("warehouseTransaction.allDirections"), value: null },
                { label: t("warehouseTransaction.inbound"), value: "inbound" },
                { label: t("warehouseTransaction.outbound"), value: "outbound" },
                { label: t("warehouseTransaction.transfer"), value: "transfer" },
            ],
        },
        {
            placeholder: "warehouseTransaction.allWarehouse",
            value: null,
            field: "warehouse",
            options: [
                { label: t("warehouseTransaction.allWarehouse"), value: null },
            ],
        },
        {
            placeholder: "warehouseTransaction.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("warehouseTransaction.allStatus"), value: null },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'waybillId', header: t('warehouseTransaction.waybillId'), sortable: true },
        { field: 'date', header: t('warehouseTransaction.date'), type: 'date', sortable: true },
        { field: 'direction', header: t('warehouseTransaction.direction'), type: 'slot', sortable: true },
        { field: 'request', header: t('warehouseTransaction.request'), sortable: true },
        { field: 'warehouse', header: t('warehouseTransaction.warehouse'), sortable: true },
        { field: 'ledgerStatus', header: t('warehouseTransaction.ledgerStatus'), sortable: true },
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
                    :showImport="false" :mainBtn="true" mainBtnText="warehouseTransaction.newTransaction" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="warehouseTransaction.searchPlaceholder" @search="onSearch" :onMainBtnClick="addWarehouseTransaction" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
                    <template v-slot:["col-direction"]="{ data }">
                        <div v-if="data.direction === 'Transfer'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-primary-50 text-primary-500">
                            <VsxIcon iconName="ArrowSwapHorizontal" type="linear" />
                            <span>{{ data.direction }}</span>
                        </div>
                        <div v-else-if="data.direction === 'Inbound'" class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-success-50 text-success-500">
                            <VsxIcon iconName="ArrowDown" type="linear" />
                            <span>{{ data.direction }}</span>
                        </div>
                        <div v-else class="flex align-items-center justify-center rounded gap-1 p-1 text-sm bg-danger-50 text-danger-500">
                            <VsxIcon iconName="ArrowUp" type="linear" />
                            <span>{{ data.direction }}</span>
                        </div>
                    </template>
                    <template v-slot:["col-ledgerStatus"]="{ data }">
                        <div class="flex align-items-center gap-2">
                            <Badge :class="data.ledgerStatus == 'Posted' ? 'status-active' : 'status-inactive'"
                                style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                            <span :class="data.ledgerStatus == 'Posted' ? 'status-text-active' : 'status-text-inactive'">
                                {{ data.ledgerStatus }}
                            </span>
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