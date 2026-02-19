<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useInventoryAdjustment } from "../composables/useInventoryAdjustment";



const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, deleteInventoryAdjustment } = useInventoryAdjustment();

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
      AdjustmentID: "PW-2026-001",
      invioceId: "#001",
      supplier: "ABC Industrial Supplies",
      date: "Oct 11, 2025",
      purchaseOrder: "PO-025",
      totalValues: "$45,000",
      status: "Posted"
      },
      {
        AdjustmentID: "PW-2026-001",
      invioceId: "#001",
      supplier: "ABC Industrial Supplies",
      date: "Oct 11, 2025",
      purchaseOrder: "PO-025",
      totalValues: "$45,000",
      status: "Pending"
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

const filtersOperation = computed(() => {
    return [
        {
            placeholder: "SalesReturn.allreason",
            value: null,
            field: "status",
            options: [
                { label: t("SalesReturn.allreason"), value: null },
                { label: t("button.Posted"), value: "IsActive" },
                { label: t("button.Pending"), value: "InActive" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'AdjustmentID', header: t('InventoryAdjustment.AdjustmentID'), type: 'slot', sortable: true },
        { field: 'invioceId', header: t('itemGroup.itemsCount'), sortable: true },
        { field: 'supplier', header: t('InventoryAdjustment.warehouse'), type: 'slot', sortable: true },
        { field: 'date', header: t('InventoryAdjustment.zone'), type: 'date', sortable: true },
        { field: 'WaybillId', header: t('InventoryAdjustment.reason'), sortable: true },
        { field: 'date', header: t('InventoryAdjustment.date'), type: 'date', sortable: true },
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
            name: "InventoryAdjustmentView",
            params: { id: 10 },
        });
    }
    if (action === 'delete') {
        confirmDelete(data);
    }
};

const handleDeleteConfirm = async () => {
    if (!rowToDelete.value) return;
    isDeleting.value = true;
    await deleteInventoryAdjustment(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addPurchaseWaybill = () => {
    router.push({name: 'InventoryAdjustmentCreate' });
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
        <ScreenHeader t title="inventory" subtitle="operation.title" actionName="InventoryAdjustment.InventoryAdjustment" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="InventoryAdjustment.InventoryAdjustment" subtitle="InventoryAdjustment.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="InventoryAdjustment.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="InventoryAdjustment.searchPlaceholder" @search="onSearch" :onMainBtnClick="addPurchaseWaybill" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" :showEdit="false" lazy >
                    <template  v-slot:["col-status"]="{ data }">
                    <div class="flex  align-items-center gap-2">
                        <Badge :class="getStatusBadge(data.status)"
                        style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                        <span :class="getStatusText(data.status)">
                            {{ data.status }}
                        </span>
                        </div>
                    </template>
                     <template #col-AdjustmentID="{ data }">
                    <span class="text-primary-500 cursor-pointer">{{ data.AdjustmentID }}</span>
                </template>
                    </DynamicTable>
              
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('InventoryAdjustment.deleteConfirm')"
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