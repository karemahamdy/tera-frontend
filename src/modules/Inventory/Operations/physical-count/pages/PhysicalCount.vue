<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { usePhysicalCount } from "../composables/usePhysicalCount";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange, deletePhysicalCount } = usePhysicalCount();

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
      WaybillId: "PW-2026-001",
      invioceId: "#001",
      supplier: "ABC Industrial Supplies",
      date: "Oct 11, 2025",
      purchaseOrder: "PO-025",
      totalValues: "$45,000",
      status: "Posted"
      },
      {
        WaybillId: "PW-2026-001",
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
            placeholder: "operation.allTypes",
            value: null,
            field: "status",
            options: [
                  { label: t("button.all"), value: null },
                { label: t("button.Pending"), value: "IsActive" },
                { label: t("button.Posted"), value: "InActive" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'WaybillId', header: t('PhysicalCount.CountID'), sortable: true },
        { field: 'invioceId', header: t('PhysicalCount.CountDate'), sortable: true },
        { field: 'supplier', header: t('PhysicalCount.warehouse'), type: 'slot', sortable: true },
        { field: 'date', header: t('PhysicalCount.zone'), type: 'date', sortable: true },
         { field: 'purchaseOrder', header: t('PhysicalCount.total'), sortable: true },
        { field: 'totalValues', header: t('PhysicalCount.Counted'), type: 'slot', sortable: true },
        { field: 'totalValues', header: t('PhysicalCount.Variances'), type: 'slot', sortable: true },
        { field: 'status', header: t('status'), type: 'status', sortable: true },
        { field: 'totalValues', header: t('PhysicalCount.Adjustment'), type: 'slot', sortable: true },
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
    await deletePhysicalCount(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const addPurchaseWaybill = () => {
    router.push({name: 'PurchaseWaybillCreate' });
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
        <ScreenHeader t title="inventory" subtitle="operation.title" actionName="PhysicalCount.PhysicalCount" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="PhysicalCount.PhysicalCount" subtitle="PhysicalCount.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="PhysicalCount.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="PhysicalCount.searchPlaceholder" @search="onSearch" :onMainBtnClick="addPurchaseWaybill" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy >
                    <template  v-slot:["col-status"]="{ data }">
            <div class="flex  align-items-center gap-2">
                        <Badge :class="getStatusBadge(data.status)"
                        style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                        <span :class="getStatusText(data.status)">
                            {{ data.status }}
                        </span>
                        </div>
                    </template>
                    </DynamicTable>
              
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('PhysicalCount.deleteConfirm')"
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