<script setup lang="ts">
import StatusDialog from "@/sharedComponents/StatusDialog.vue";
import alertIcon from '@/assets/images/alert.png';
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { usewarehouse } from "../composables/usewarehouse";


const { t } = useI18n();
const router = useRouter();
const showDeleteDialog = ref(false);
const rowToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const { loading, deleteBranch, toggleActive, pageIndex, pageSize, totalCount, onSearch, onSort, setPage } = usewarehouse();

// onMounted(() => {
//     ();
// });
const emit = defineEmits(['search', 'action-menu-click']);
const customItems = [
    {
        action: "toggleActive",
        changeStatus: true,
        label: t("button.active"),
        type: "switch",
        key: "isActive",
    },
     {
      slot: true,
      label: t("button.view"),
      icon: "Eye",
      color: "#3F5FAC",
      command: (row: any) => {
        router.push({ name: "WarehouseView", params: { row } });
      },
    },
];
const props = defineProps({
  data: {
    type: Array,
    default: () => [
      {
        code: "WH-001",
        name: "John Moore",
        transferLedger: "5",
        zones: "Administration",
        address: "Finance",
        type: "Global",
        status: "in Active",
      },
      {
        code: "WH-001",
        name: "John Moore",
        transferLedger: "5",
        zones: "Administration",
        address: "Finance",
        type: "Professional",
        status: "Active",
      },
    ],
  },
});
const filtersOperation = computed(() => {
    return [
        {
            placeholder: "warehouses.type",
            value: null,
            field: "type",
            options: [
                { label: t("button.active"), value: "IsActive" },
                { label: t("button.active"), value: "IsActive" },   
            ],
        },
        {
            placeholder: "warehouses.zones",
            value: null,
            field: "zones",
            options: [        
          { label: t("button.active"), value: "IsActive" },
            { label: t("button.active"), value: "IsActive" }, 
            ],
        },
        {
            placeholder: "activeSessions.allStatus",
            value: null,
            field: "status",
            options: [
                { label: t("button.active"), value: "IsActive" },
                { label: t("button.inactive"), value: "InActive" },
            ],
        }
    ]
});

const columns = computed(() => {
    const Columns = [ 
        { field: 'code', header: t('warehouses.code'), sortable: true },
        { field: 'name', header: t('warehouses.name'), type: 'slot', sortable: true },
        { field: 'type', header: t('warehouses.type'), type: 'badge', sortable: true , Class: 'custom-badge'},
        { field: 'address', header: t('warehouses.address'), sortable: true },
        { field: 'zones', header: t('warehouses.zones'), sortable: true },
        { field: 'transferLedger', header: t('warehouses.transferLedger'), sortable: true },
        { field: 'status', header: t('status'), type: 'status', sortable: true },
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
    if (action === "edit") {
        if (data && data.id) {
            handleEdit(data);
        }
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
    await deleteBranch(rowToDelete.value.id).finally(() => {
        isDeleting.value = false;
        showDeleteDialog.value = false;
        rowToDelete.value = null;
    });
};

const handleEdit = (row: any) => {
    router.push(`/warehouses/edit/${row.id}`);
};

const addBranch = () => {
    router.push('/warehouses/create');
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="inventory" subtitle="masterData" actionName="warehouses.title" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="warehouses.title" subtitle="warehouses.subtitle" :showExport="true"
                    :showImport="true" :mainBtn="true" mainBtnText="warehouses.addWarehouse"   :showFilter="true"
          :filters="filtersOperation"
                    searchPlaceholder="warehouses.searchPlaceholder" @search="onSearch" :onMainBtnClick="addBranch" />
            </template>
            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :customItems="customItems"
                    @action-menu-click="handleActionMenu" :showDelete="true" @page-change="setPage" @order-change="(payload: any) => onSort(payload.orderBy, payload.direction)" :first="firstRecord"
                    :last="lastRecord" :rows="pageSize" :totalRecords="totalCount"  @search="onSearch" lazy />
              
            </template>
        </card>

        <StatusDialog v-model:visible="showDeleteDialog" :icon="alertIcon" :title="$t('warehouses.deleteWarehousesConfirm')"
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