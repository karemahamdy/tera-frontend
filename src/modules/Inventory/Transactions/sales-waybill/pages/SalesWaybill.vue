<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSalesWaybill } from "../composables/useSales";
import RulesCard from "@/sharedComponents/RulesCard.vue";

const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, deleteSalesWaybill, onFilterChange, fetchSalesWaybill, apiSalesWaybill } = useSalesWaybill();

const rules = [
  "rules.stockAvailable",    
  "rules.serialLot",         
  "rules.multiUoM",          
  "rules.shippingStock",    
  "rules.carrierIntegration" 
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
    fetchSalesWaybill();
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("usersManagement.allStatus"), value: null },
                { label: t("button.Pending"), value: 1 },
                { label: t("button.Shipped"), value: 2 },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [
        { field: 'documentNumber', header: t('salesWaybill.WaybillId'), sortable: true },
        { field: 'customerName', header: t('salesWaybill.customer'), sortable: true },
        { field: 'waybillDate', header: t('salesWaybill.date'), type: 'date', sortable: true },
        { field: 'itemCount', header: t('salesWaybill.items'), type: 'slot', sortable: true },
        { field: 'grandTotal', header: t('salesWaybill.total'), sortable: true },
        { field: 'trackingNumber', header: t('salesWaybill.tracking'), type: 'slot', sortable: true },
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
    await deleteSalesWaybill(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addPurchaseWaybill = () => {
    router.push({ name: 'SalesWaybillCreate' });
};
const getStatusBadge = (status: any) => {
    return status === "Shipped" ? "status-active" : "status-inactive";
}
const getStatusText = (status: any) => {
    return status === "Shipped" ? "status-text-active" : "status-text-inactive";
}
</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory"  subtitle="operation.transactions" actionName="salesWaybill.salesWaybill" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="salesWaybill.salesWaybill" subtitle="salesWaybill.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="salesWaybill.addNew" :showFilter="true"
                    :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="salesWaybill.searchPlaceholder" @search="onSearch"
                    :onMainBtnClick="addPurchaseWaybill" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="apiSalesWaybill" :loading="loading" :customItems="customItems"
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
                      <template  v-slot:["col-WaybillId"]="{ data }">
                        <span class="text-primary-500 cursor-pointer underline">{{ data.WaybillId }}</span>
                    </template>
                </DynamicTable>
            </template>
            <template #footer>
                <RulesCard title="rules.ruleHeader" :items="rules" color="warning" />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('salesWaybill.deleteConfirm')"
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