<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useOpeningBalance } from "../composables/useOpeningBalance";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);
const { loading, pageIndex, pageSize, totalCount, onSearch, onSort, setPage, onFilterChange } = useOpeningBalance();

const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
      WaybillId: "PW-2026-001",
      invioceId: "#001",
      supplier: "ABC Industrial Supplies",
      date: "Zone A",
      purchaseOrder: "PO-025",
      totalValues: "$45,000",
      status: "Dec 11, 2025"
      },
      {
        WaybillId: "PW-2026-001",
      invioceId: "#001",
      supplier: "ABC Industrial Supplies",
      date: "Zone A",
      purchaseOrder: "PO-025",
      totalValues: "$45,000",
      status: "Dec 11, 2025"
      },
    ],
  },
});


const filtersOperation = computed(() => {
    return [
        {
            placeholder: "items.uom",
            value: null,
            field: "status",
            options: [
                  { label: t("items.uom"), value: null },
                { label: t("button.Pending"), value: "IsActive" },
                { label: t("button.Posted"), value: "InActive" },
            ],
        },
         {
            placeholder: "warehouses.title",
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
        { field: 'WaybillId', header: t('OpeningBalance.OBID'), sortable: true },
        { field: 'date', header: t('OpeningBalance.date'), type: 'date', sortable: true },
        { field: 'totalValues', header: t('OpeningBalance.ItemName'), type: 'slot', sortable: true },
        { field: 'supplier', header: t('OpeningBalance.warehouse'), type: 'slot', sortable: true },
        { field: 'date', header: t('OpeningBalance.zone'), type: 'date', sortable: true },
        { field: 'totalValues', header: t('OpeningBalance.Uom'), type: 'slot', sortable: true },
        { field: 'purchaseOrder', header: t('OpeningBalance.Quantity'), sortable: true },
        { field: 'totalValues', header: t('OpeningBalance.UnitCost'), type: 'slot', sortable: true },
        { field: 'invioceId', header: t('OpeningBalance.TotalValue'), sortable: true },
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
            name: "OpeningBalanceEdit",
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
    // await deleteOpeningBalance(rowToDelete.value.id).finally(() => {
    //     isDeleting.value = false;
    //     showDeleteDialog.value = false;
    //     rowToDelete.value = null;
    // });
};

const addPurchaseWaybill = () => {
    router.push({name: 'OpeningBalanceCreate' });
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader t title="inventory" subtitle="operation.title" actionName="OpeningBalance.OpeningBalance" />
        <card class="bg-white rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="OpeningBalance.OpeningBalance" subtitle="OpeningBalance.subtitle" :showExport="false"
                    :showImport="false" :mainBtn="true" mainBtnText="OpeningBalance.addNew" :showFilter="true"
               :filters="filtersOperation" @filter-change="onFilterChange"
                    searchPlaceholder="OpeningBalance.searchPlaceholder" @search="onSearch" :onMainBtnClick="addPurchaseWaybill" 
                    />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy />
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('OpeningBalance.deleteConfirm')"
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

</style>