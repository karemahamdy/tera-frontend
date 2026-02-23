<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSalesReturn } from "../composables/useSalesReturn";
import RulesCard from "@/sharedComponents/RulesCard.vue";
import { useLookups } from "@/composables/useLookups";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteSalesReturn, onFilterChange, fetchSalesReturn, apiSalesReturn } = useSalesReturn();
const { reasonsLookups, getReasonLookups } = useLookups();  

const rules = [
  "salesRules.stockAvailable",    
  "salesRules.serialLot",         
  "salesRules.multiUoM",          
  "salesRules.shippingStock",    
  "salesRules.carrierIntegration" ,
  "salesRules.serialIntegration" 
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
   Promise.all([
        getReasonLookups(), 
         fetchSalesReturn()
    ]);
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            isSingle: true,
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.Pending"), value: 1 },
                { label: t("button.Posted"), value: 2 },
            ],
        },
         {
            placeholder: "SalesReturn.allreason",
            value: null,
            field: "ReturnReason",
             isSingle: true,
            options: [
                 ...reasonsLookups.value
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'documentNumber', header: t('SalesReturn.returnId'), sortable: true },
        { field: 'customerName', header: t('SalesReturn.customer'), sortable: true },
        { field: 'invoiceNumber', header: t('SalesReturn.invoiceID'), sortable: true },
        { field: 'originalWaybillNumbers', header: t('SalesReturn.originalWaybill'), sortable: true },
        { field: 'itemCount', header: t('SalesReturn.items'), type: 'slot', sortable: true },
        { field: 'returnDate', header: t('SalesReturn.date'), type: 'date', sortable: true },
        { field: 'grandTotal', header: t('SalesReturn.total'), sortable: true },
        { field: 'returnReason', header: t('SalesReturn.reason'), type: 'slot', sortable: true },
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
            name: "PurchaseWaybillFormEdit",
            params: { id: data.id },
        });
    }
    if (action === 'view') {
        router.push({
            name: "PurchaseWaybillFormView",
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

const addPurchaseWaybill = () => {
    router.push({ name: 'SalesReturnCreate' });
};
const getStatusBadge = (status: any) => {
    return status === "Posted" ? "status-active" : "status-inactive";
}
const getStatusText = (status: any) => {
    return status === "Posted" ? "status-text-active" : "status-text-inactive";
}
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory"  subtitle="operation.transactions" actionName="SalesReturn.salesReturn" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="SalesReturn.salesReturn" subtitle="SalesReturn.subtitle" :showExport="false"
                :showImport="false" :mainBtn="true" mainBtnText="SalesReturn.addNew"  :showMultiFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="SalesReturn.searchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addPurchaseWaybill" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiSalesReturn" :loading="loading" :customItems="customItems"
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
                      <template  v-slot:["col-documentNumber"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline">{{ data.documentNumber }}</span>
                    </template>
                      <template  v-slot:["col-originalWaybillNumbers"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline">{{ data.originalWaybillNumbers }}</span>
                    </template>
                </DynamicTable>
            </template>
            <template #footer>
                <RulesCard title="salesRules.ruleHeader" :items="rules" color="success" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('SalesReturn.deleteConfirm')"
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