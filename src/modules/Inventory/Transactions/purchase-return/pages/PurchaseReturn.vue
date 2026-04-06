<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { usePurchaseReturn } from "../composables/usePurchasReturn";
import RulesCard from "@/sharedComponents/RulesCard.vue";
import { useInventoryLookups } from "@/composables/useInventoryLookups";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteSalesReturn, onFilterChange, fetchPurchaseReturn, apiPurchaseReturn } = usePurchaseReturn();
const {supplierLookups, getSupplierLookups} = useInventoryLookups()
const rules = [
  "purchaseRules.stockAvailable",    
  "purchaseRules.serialLot",         
  "purchaseRules.multiUoM",          
  "purchaseRules.shippingStock",    
  "purchaseRules.carrierIntegration" ,
  "purchaseRules.serialIntegration" 
];

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
    fetchPurchaseReturn();
    getSupplierLookups()
});
const filtersOperation = computed(() => {
    return [
          {
            placeholder: "purchaseWaybill.allsupplier",
            value: null,
            field: "SupplierId",
            options: [
                { label: t("purchaseWaybill.allsupplier"), value: null },
              ...supplierLookups.value
            ],
        },
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.Posted"), value: 2 },
                { label: t("button.Pending"), value: 1 },
            ],
        },
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'documentNumber', header: t('purchaseReturn.returnId'), sortable: true },
        { field: 'supplierName', header: t('purchaseReturn.supplier'), sortable: true },
        { field: 'originalWaybillNumbers', header: t('purchaseReturn.originalPW'), sortable: true },
        { field: 'returnDate', header: t('purchaseReturn.date'), type: 'date', sortable: true },
        { field: 'itemCount', header: t('purchaseReturn.items'), type: 'slot', sortable: true },
        // { field: 'grandTotalBase', header: t('purchaseReturn.total'), sortable: true },
        { field: 'returnReason', header: t('purchaseReturn.reason'), type: 'slot', sortable: true },
        { field: 'status', header: t('status'), type: 'status', sortable: true },
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
            name: "PurchaseReturnEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "PurchaseReturnView",
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
    await deleteSalesReturn(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addPurchaseReturn = () => {
    router.push({ name: 'PurchaseReturnCreate' });
};
const getStatusBadge = (status: any) => {
    return status === "Posted" || status === "مُرحَّل"
        ? "status-active"
        : "status-inactive";
};

const getStatusText = (status: any) => {
    return status === "Posted" || status === "مُرحَّل"
        ? "status-text-active"
        : "status-text-inactive";
};
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="operation.transactions" actionName="purchaseReturn.purchaseReturn" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="purchaseReturn.purchaseReturn" subtitle="purchaseReturn.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="purchaseReturn.addNew" :showFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="purchaseReturn.searchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addPurchaseReturn" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiPurchaseReturn" :loading="loading" :customItems="customItems"
                    :canEdit="(row: any) => row.status !== 'Posted' && row.status !== 'مُرحَّل'"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage"
                    @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount" @search="onSearch" lazy>
                    <template v-slot:["col-status"]="{ data }">
                        <div class="flex  align-items-center gap-2">
                            <Badge :class="getStatusBadge(data.status)"
                                style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                            <span :class="getStatusText(data.status)">
                                {{ data.status }}
                            </span>
                        </div>
                    </template>
                     <template #col-originalPW="{ data }">
                    <span class="text-primary-500 cursor-pointer underline">{{ data.originalPW }}</span>
                </template>
                 <template #col-returnId="{ data }">
                    <span class="text-primary-500 cursor-pointer underline">{{ data.returnId }}</span>
                </template>
                </DynamicTable>
            </template>
            <template #footer>
                <RulesCard title="purchaseRules.ruleHeader" :items="rules" color="success" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('purchaseReturn.deleteConfirm')"
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